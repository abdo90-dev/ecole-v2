import React, { useState } from 'react';
import { 
  Edit, 
  Trash2, 
  Plus, 
  Search,
  Download,
  Filter
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { StudentForm } from './StudentForm';
import { useStudents } from '../../hooks/useStudents';
import { Student } from '../../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export const StudentList: React.FC = () => {
  const { students, loading, createStudent, updateStudent, deleteStudent } = useStudents();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const filteredStudents = students.filter(student => {
    const fullName = `${student.profile?.first_name} ${student.profile?.last_name}`.toLowerCase();
    const studentNumber = student.student_number.toLowerCase();
    const specialty = student.specialty?.name.toLowerCase() || '';
    
    return fullName.includes(searchTerm.toLowerCase()) ||
           studentNumber.includes(searchTerm.toLowerCase()) ||
           specialty.includes(searchTerm.toLowerCase());
  });

  const handleCreateStudent = () => {
    setEditingStudent(null);
    setShowModal(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setShowModal(true);
  };

  const handleSubmitStudent = async (data: any) => {
    setFormLoading(true);
    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, data);
        toast.success('Étudiant mis à jour avec succès');
      } else {
        await createStudent(data);
        toast.success('Étudiant créé avec succès');
      }
      setShowModal(false);
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      try {
        await deleteStudent(id);
        toast.success('Étudiant supprimé avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const exportToCSV = () => {
    const csv = [
      ['Numéro', 'Nom', 'Prénom', 'Email', 'Filière', 'Année', 'Statut', 'Téléphone'],
      ...filteredStudents.map(student => [
        student.student_number,
        student.profile?.last_name || '',
        student.profile?.first_name || '',
        student.profile?.email || '',
        student.specialty?.name || '',
        student.year,
        student.status,
        student.phone
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `etudiants_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'graduated':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'inactive':
        return 'Inactif';
      case 'graduated':
        return 'Diplômé';
      default:
        return status;
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
            <CardTitle>Liste des Étudiants</CardTitle>
            <div className="flex space-x-2">
              <Button
                onClick={exportToCSV}
                variant="secondary"
                icon={Download}
                size="sm"
              >
                Exporter
              </Button>
              <Button
                onClick={handleCreateStudent}
                icon={Plus}
                size="sm"
              >
                Nouvel Étudiant
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="mb-4 flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher un étudiant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
            <Button variant="secondary" icon={Filter} size="sm">
              Filtres
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Numéro</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Nom</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Filière</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Année</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Statut</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{student.student_number}</td>
                    <td className="py-3 px-4">
                      {student.profile?.first_name} {student.profile?.last_name}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{student.profile?.email}</td>
                    <td className="py-3 px-4">{student.specialty?.name}</td>
                    <td className="py-3 px-4">Année {student.year}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.status)}`}>
                        {getStatusLabel(student.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleEditStudent(student)}
                          variant="ghost"
                          size="sm"
                          icon={Edit}
                        >
                          Modifier
                        </Button>
                        <Button
                          onClick={() => handleDeleteStudent(student.id)}
                          variant="ghost"
                          size="sm"
                          icon={Trash2}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredStudents.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {searchTerm ? 'Aucun étudiant trouvé' : 'Aucun étudiant enregistré'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingStudent ? 'Modifier l\'étudiant' : 'Nouvel étudiant'}
        size="lg"
      >
        <StudentForm
          student={editingStudent}
          onSubmit={handleSubmitStudent}
          onCancel={() => setShowModal(false)}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};