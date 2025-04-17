'use client';

import { saveTrain } from '@/actions/save-action';
import { useActionState } from 'react';
import { Train } from '@/models/train';

type TrainFormProps = {
  initialData?: Train;
  isEditing?: boolean;
  user: {
    id: string;
    email: string;
  } | null;
};

const stations = ['Київ', 'Львів', 'Одеса', 'Харків', 'Дніпро'];

export default function TrainForm({ user, initialData, isEditing }: TrainFormProps) {
  const [state, formAction] = useActionState(saveTrain, { message: ' ' });



  return (
    <form action={formAction} className="max-w-4xl mx-auto bg-white shadow-md rounded p-6 mb-6">
  <h2 className="text-lg font-semibold mb-4">
    {isEditing ? 'Редагування поїзда' : 'Додавання нового поїзда'}
  </h2>

  {isEditing && initialData?.id && (
    <input type="hidden" name="id" value={initialData.id} />
  )}
  <input type="hidden" name="isEditing" value={isEditing ? 'true' : 'false'} />
  <input type="hidden" name="userId" value={user?.id} />

  <input
    type="text"
    name="train_number"
    placeholder="Номер поїзда"
    className="border rounded p-2 w-full mb-4"
    defaultValue={initialData?.train_number || ''}
  />

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <select
      name="from_station"
      required
      className="border rounded p-2"
      defaultValue={initialData?.from_station || ''}
    >
      <option value="">Звідки</option>
      {stations.map((station) => (
        <option key={station} value={station}>
          {station}
        </option>
      ))}
    </select>

    <select
      name="to_station"
      required
      className="border rounded p-2"
      defaultValue={initialData?.to_station || ''}
    >
      <option value="">Куди</option>
      {stations.map((station) => (
        <option key={station}>{station}</option>
      ))}
    </select>

    <input
      type="datetime-local"
      name="departure_time"
      required
      className="border rounded p-2"
      defaultValue={initialData?.departure_time || ''}
    />

    <input
      type="datetime-local"
      name="arrival_time"
      required
      className="border rounded p-2"
      defaultValue={initialData?.arrival_time || ''}
    />
  </div>

  {state?.message && <p className="text-red-600 mt-2">{state.message}</p>}

  <button
    type="submit"
    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  >
    {isEditing ? 'Оновити поїзд' : 'Додати поїзд'}
  </button>
</form>

  );
}
