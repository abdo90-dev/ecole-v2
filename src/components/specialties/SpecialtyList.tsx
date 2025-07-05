import React, { useState } from 'react';
import { 
  Edit, 
  Trash2, 
  Plus, 
  Search,
  BookOpen
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { SpecialtyForm } from './SpecialtyForm';
import { useSpecialties } from '../../hooks/useSpecialties';
import { Specialty } from '../../types';
import toast from 'react-hot-toast';

export const SpecialtyList: React.FC = () => {
  const { specialties, loading, createSpecialty, updateSpecialty, deleteSpecialty } = useSpecialties();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const filteredSpecialties = specialties.filter(specialty =>
    specialty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    specialty.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSpecialty = () => {
    setEditingSpecialty(null);
    setShowModal(true);
  };

  const handleEditSpecialty = (specialty: Specialty) => {
    setEditingSpecialty(specialty);
    setShowModal(true);
  };

  const handleSubmitSpecialty = async (data: any) => {
    setFormLoading(true);
    try {
      if (editingSpecialty) {
        await updateSpecialty(editingSpecialty.id, data);
        toast.success('Filière mise à jour avec succès');
      } else {
        await createSpecialty(data);
        toast.success('Filière créée avec succès');
      }
      setShowModal(false);
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteSpecialty = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette filière ?')) {
      try {
        await deleteSpecialty(id);
        toast.success('Filière supprimée avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Liste des Filières</CardTitle>
            <Button
              onClick={handleCreateSpecialty}
              icon={Plus}
              size="sm"
            >
              Nouvelle Filière
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Rechercher une filière..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSpecialties.map((specialty) => (
              <Card key={specialty.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{specialty.name}</h3>
                        <p className="text-sm text-gray-500">{specialty.code}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        onClick={() => handleEditSpecialty(specialty)}
                        variant="ghost"
                        size="sm"
                        icon={Edit} children={undefined}                      >
                      </Button>
                      <Button
                        onClick={() => handleDeleteSpecialty(specialty.id)}
                        variant="ghost"
                        size="sm"
                        icon={Trash2} children={undefined}                      >
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm text-gray-600">{specialty.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Durée: {specialty.duration_years} ans
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredSpecialties.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchTerm ? 'Aucune filière trouvée' : 'Aucune filière enregistrée'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingSpecialty ? 'Modifier la filière' : 'Nouvelle filière'}
        size="md"
      >
        <SpecialtyForm
          specialty={editingSpecialty}
          onSubmit={handleSubmitSpecialty}
          onCancel={() => setShowModal(false)}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};