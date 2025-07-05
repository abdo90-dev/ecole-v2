import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Specialty } from '../../types';
import { Save, X } from 'lucide-react';

interface SpecialtyFormProps {
  specialty?: Specialty| null
  ;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const SpecialtyForm: React.FC<SpecialtyFormProps> = ({
  specialty,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: specialty ? {
      name: specialty.name,
      code: specialty.code,
      description: specialty.description,
      duration_years: specialty.duration_years,
    } : {
      name: '',
      code: '',
      description: '',
      duration_years: 3,
    }
  });

  const handleFormSubmit = async (data: any) => {
    await onSubmit({
      ...data,
      duration_years: parseInt(data.duration_years),
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nom de la filière"
          {...register('name', { required: 'Le nom de la filière est requis' })}
          error={errors.name?.message}
          placeholder="ex: Informatique"
        />
        
        <Input
          label="Code"
          {...register('code', { required: 'Le code est requis' })}
          error={errors.code?.message}
          placeholder="ex: INF"
        />
      </div>
      
      <Input
        label="Durée (en années)"
        type="number"
        min={1}
        max={10}
        {...register('duration_years', { required: 'La durée est requise' })}
        error={errors.duration_years?.message}
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          {...register('description', { required: 'La description est requise' })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Description de la filière..."
        />
        {errors.description && (
          <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
        )}
      </div>
      
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
          {specialty ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};