import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Student } from '../../types';
import { useSpecialties } from '../../hooks/useSpecialties';
import { Save, X } from 'lucide-react';

interface StudentFormProps {
  student?: Student|null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const StudentForm: React.FC<StudentFormProps> = ({
  student,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const { specialties } = useSpecialties();
 const { register, handleSubmit, formState: { errors }, reset } = useForm({
  defaultValues: student ? {
    student_number: student.student_number,
    phone: student.phone,
    address: student.address,
    specialty_id: student.specialty_id,
    year: student.year,
    status: student.status,
    birth_date: student.birth_date,
    email: student.profile?.email,
    first_name: student.profile?.first_name ?? '',
    last_name: student.profile?.last_name ?? '',
  } : {
    student_number: '',
    phone: '',
    address: '',
    specialty_id: '',
    year: 1,
    status: 'active',
    birth_date: '',
    email: '',
    first_name: '',
    last_name: '',
  }
});


  const specialtyOptions = specialties.map(specialty => ({
    value: specialty.id,
    label: `${specialty.name} (${specialty.code})`,
  }));

  const statusOptions = [
    { value: 'active', label: 'Actif' },
    { value: 'inactive', label: 'Inactif' },
    { value: 'graduated', label: 'Diplômé' },
  ];

  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `Année ${i + 1}`,
  }));

  const handleFormSubmit = async (data: any) => {
    await onSubmit({
      ...data,
      year: parseInt(data.year),
    });
  };
console.log(specialties);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Numéro d'étudiant"
          {...register('student_number', { required: 'Le numéro d\'étudiant est requis' })}
          error={errors.student_number?.message}
        />
        <Input
  label="Prénom"
  {...register('first_name', { required: 'Le prénom est requis' })}
  error={errors.first_name?.message}
/>

<Input
  label="Nom"
  {...register('last_name', { required: 'Le nom est requis' })}
  error={errors.last_name?.message}
/>

        <Input
          label="Date de naissance"
          type="date"
          {...register('birth_date', { required: 'La date de naissance est requise' })}
          error={errors.birth_date?.message}
        />
        
        <Input
          label="Téléphone"
          {...register('phone', { required: 'Le téléphone est requis' })}
          error={errors.phone?.message}
        />

        <Input
          label="Email"
          type="email"
          {...register('email', { 
            required: 'L\'email est requis',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Adresse email invalide'
            }
          })}
          error={errors.email?.message}
        />
        
        <Select
          label="Filière"
          {...register('specialty_id', { required: 'La filière est requise' })}
          options={specialtyOptions}
          error={errors.specialty_id?.message}
        />
        
        <Select
          label="Année"
          {...register('year', { required: 'L\'année est requise' })}
          options={yearOptions}
          error={errors.year?.message}
        />
        
        <Select
          label="Statut"
          {...register('status', { required: 'Le statut est requis' })}
          options={statusOptions}
          error={errors.status?.message}
        />
      </div>
      
      <Input
        label="Adresse"
        {...register('address', { required: 'L\'adresse est requise' })}
        error={errors.address?.message}
      />
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          icon={X}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          loading={loading}
          icon={Save}
        >
          {student ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};