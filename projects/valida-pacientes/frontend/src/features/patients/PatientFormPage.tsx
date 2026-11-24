import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/shared/PageHeader';
import { Alert, Button, Card, LoadingState, SelectField, TextAreaField, TextField } from '../../components/ui';
import { PatientInput, patientSchema } from '../../lib/schemas';
import { ApiRequestError, createPatient, getPatient, listDoctors, updatePatient } from '../../services/api';

export function PatientFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const editing = Boolean(id);
  const doctors = useQuery({ queryKey: ['doctors'], queryFn: listDoctors });
  const current = useQuery({ queryKey: ['patient', id], queryFn: () => getPatient(id ?? ''), enabled: editing });
  const form = useForm<PatientInput>({
    resolver: zodResolver(patientSchema),
    defaultValues: { fullName: '', birthDate: '', documentLast4: '', operationalNote: '', assignedDoctorId: '' },
  });

  useEffect(() => {
    if (!current.data) return;
    form.reset({
      fullName: current.data.fullName,
      birthDate: current.data.birthDate,
      documentLast4: current.data.documentLast4,
      operationalNote: current.data.operationalNote ?? '',
      assignedDoctorId: current.data.assignedDoctor.id,
    });
  }, [current.data, form]);

  const mutation = useMutation({
    mutationFn: (values: PatientInput) => {
      const payload = {
        fullName: values.fullName,
        birthDate: values.birthDate,
        documentLast4: values.documentLast4,
        operationalNote: values.operationalNote.trim() || null,
        assignedDoctorId: values.assignedDoctorId,
      };
      return editing && id ? updatePatient(id, payload) : createPatient({ ...payload, operationalNote: payload.operationalNote ?? undefined });
    },
    onSuccess: async (patient) => {
      await queryClient.invalidateQueries({ queryKey: ['patients'] });
      await queryClient.invalidateQueries({ queryKey: ['patient', patient.id] });
      navigate(`/pacientes/${patient.id}`);
    },
  });

  if (editing && current.isLoading) return <LoadingState label="Carregando cadastro…" />;
  if (doctors.isLoading) return <LoadingState label="Carregando médicos…" />;
  if (doctors.isError || (editing && current.isError)) {
    return <Alert>Não foi possível carregar o formulário.</Alert>;
  }

  const apiError = mutation.error instanceof ApiRequestError ? mutation.error : null;

  return (
    <section className="mx-auto max-w-xl">
      <PageHeader
        leading={
          <Link to={id ? `/pacientes/${id}` : '/pacientes'} className="text-sm font-semibold text-secondary">
            Voltar
          </Link>
        }
        title={editing ? 'Editar paciente' : 'Novo paciente'}
        description="Só dados para reconhecer a pessoa na lista. Alterar nome, nascimento, documento ou médico devolve o status para pendente."
      />
      <Card className="p-5">
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(async (values) => {
            await mutation.mutateAsync(values);
          })}
          noValidate
        >
          {apiError ? <Alert>{apiError.message}</Alert> : null}
          <TextField label="Nome completo" {...form.register('fullName')} error={form.formState.errors.fullName?.message ?? apiError?.details.find((item) => item.field === 'fullName')?.message} />
          <TextField label="Data de nascimento" type="date" {...form.register('birthDate')} error={form.formState.errors.birthDate?.message ?? apiError?.details.find((item) => item.field === 'birthDate')?.message} />
          <TextField label="4 últimos dígitos do documento" inputMode="numeric" maxLength={4} {...form.register('documentLast4')} error={form.formState.errors.documentLast4?.message ?? apiError?.details.find((item) => item.field === 'documentLast4')?.message} />
          <SelectField label="Médico responsável" {...form.register('assignedDoctorId')} error={form.formState.errors.assignedDoctorId?.message ?? apiError?.details.find((item) => item.field === 'assignedDoctorId')?.message}>
            <option value="">Selecione</option>
            {doctors.data?.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </SelectField>
          <TextAreaField label="Nota operacional" {...form.register('operationalNote')} error={form.formState.errors.operationalNote?.message} />
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Salvando…' : 'Salvar'}
          </Button>
        </form>
      </Card>
    </section>
  );
}
