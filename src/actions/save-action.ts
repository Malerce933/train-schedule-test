'use server';

import { revalidatePath } from 'next/cache';
import { addTrainToDB, TrainInput, updateTrainInDB } from '../lib/db';
import { redirect } from 'next/navigation';
import { deleteTrainFromDB } from '../lib/db';

function isInvalid(text: string) {
  return !text || text.trim() === '';
}

export async function saveTrain(prevState: any, formData: FormData) {
  const isEditing = formData.get('isEditing') === 'true';

  const train = {
    id: isEditing ? parseInt(formData.get('id') as string) : undefined,
    train_number: formData.get('train_number') as string,
    from_station: formData.get('from_station') as string,
    to_station: formData.get('to_station') as string,
    departure_time: formData.get('departure_time') as string,
    arrival_time: formData.get('arrival_time') as string,
    userId: formData.get('userId') as string
  };


  if (train.from_station === train.to_station) {
    return { message: 'Некоректні станції' };
  }

  if (isEditing && train.id !== undefined) {
    await updateTrainInDB(train as TrainInput & { id: number });
  } else {
    await addTrainToDB(train);
  }
  
  revalidatePath('/schedule', 'page');
  redirect('/schedule');
}

export async function deleteTrainAction(id: number, userId: string) {
  await deleteTrainFromDB(id, userId);
  revalidatePath('/schedule'); 
  redirect('/schedule');
}
