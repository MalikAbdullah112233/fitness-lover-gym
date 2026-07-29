import { getItem, setItem, STORAGE_KEYS } from './storageProvider';

export const trainersService = {
  async getTrainers() {
    return await getItem(STORAGE_KEYS.TRAINERS);
  },

  async addTrainer(trainerData) {
    const trainers = await getItem(STORAGE_KEYS.TRAINERS);
    const nextNum = 100 + trainers.length + 1;
    const newTrainer = {
      id: `TRN-${nextNum}`,
      name: trainerData.name,
      phone: trainerData.phone,
      email: trainerData.email || '',
      specialty: trainerData.specialty || 'General Fitness',
      experience: trainerData.experience || '1 Year',
      shift: trainerData.shift || 'Morning (6:00 AM - 12:00 PM)',
      status: 'Active',
      rating: 5.0,
      assignedClientsCount: 0,
      avatar: trainerData.avatar || `https://images.unsplash.com/photo-${1534528741775 + trainers.length}?w=150&auto=format&fit=crop&q=80`
    };

    const updated = [newTrainer, ...trainers];
    await setItem(STORAGE_KEYS.TRAINERS, updated);
    return newTrainer;
  },

  async updateTrainer(id, updateData) {
    const trainers = await getItem(STORAGE_KEYS.TRAINERS);
    const index = trainers.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Trainer not found');

    trainers[index] = { ...trainers[index], ...updateData };
    await setItem(STORAGE_KEYS.TRAINERS, trainers);
    return trainers[index];
  },

  async deleteTrainer(id) {
    const trainers = await getItem(STORAGE_KEYS.TRAINERS);
    const filtered = trainers.filter((t) => t.id !== id);
    await setItem(STORAGE_KEYS.TRAINERS, filtered);
    return true;
  }
};
