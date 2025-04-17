import { Pool } from 'pg';

export const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT || '5432'),
});


export type TrainInput = {
    id?: number;
    train_number?: string;
    from_station: string;
    to_station: string;
    departure_time: string;
    arrival_time: string;
    userId: string;
  };
  

  export async function addTrainToDB(train: TrainInput) {
    console.log(process.env.PG_USER);
    console.log(process.env.PG_PASSWORD);
  
    const query = `
      INSERT INTO train_schedule.trains 
      (train_number, from_station, to_station, departure_time, arrival_time, user_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id;`;
  
    const values = [
      train.train_number,
      train.from_station,
      train.to_station,
      train.departure_time,
      train.arrival_time,
      train.userId, 
    ];
  
    try {
      const result = await pool.query(query, values);
      const newTrainId = result.rows[0].id;
      console.log('Додано новий потяг з ID:', newTrainId);
      return newTrainId;
    } catch (err) {
      console.error('Помилка при додаванні потяга:', err);
      throw err;
    }
}

  

export async function getAllTrainsFromDB(userId: string) {
    const query = `SELECT * FROM train_schedule.trains WHERE user_id = $1 ORDER BY id;`;
  
    try {
      const result = await pool.query(query, [userId]);
      return result.rows; 
    } catch (err) {
      console.error('Помилка при отриманні потягів:', err);
      throw err;
    }
}

export async function deleteTrainFromDB(id: number, userId: string) {
    const query = `DELETE FROM train_schedule.trains WHERE id = $1 AND user_id = $2;`;
  
    try {
      const result = await pool.query(query, [id, userId]);
      if(result.rowCount) {
        if (result.rowCount > 0) {
            console.log('Потяг з ID видалено:', id);
          } else {
            console.log('Не знайдено потяг з таким ID або потяг не належить цьому користувачу.');
          }
      }
    } catch (err) {
      console.error('Помилка при видаленні потяга:', err);
      throw err;
    }
}

export async function updateTrainInDB(train: TrainInput & { id: number }) {
    const query = `
      UPDATE train_schedule.trains
      SET
        train_number = $1,
        from_station = $2,
        to_station = $3,
        departure_time = $4,
        arrival_time = $5
      WHERE id = $6 AND user_id = $7
      RETURNING id;`;
  
    const values = [
      train.train_number,
      train.from_station,
      train.to_station,
      train.departure_time,
      train.arrival_time,
      train.id,
      train.userId,
    ];
  
    try {
      const result = await pool.query(query, values);
      if(result.rowCount) {
        if (result.rowCount > 0) {
            const updatedTrainId = result.rows[0].id;
            console.log('Оновлено потяг з ID:', updatedTrainId);
            return updatedTrainId;
          } else {
            console.log('Не знайдено потяг для оновлення або він не належить цьому користувачу.');
            return null;
          }
      }
    } catch (err) {
      console.error('Помилка при оновленні потяга:', err);
      throw err;
    }
}
