const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const MONGO_URI = process.env.MONGO_URL || process.env.DATABASE_URL || 'mongodb://localhost:27017/RecoveryMenu';

mongoose.connect(MONGO_URI)
  .then(() => console.log('[MongoDB] Conectado exitosamente'))
  .catch(err => console.error('[MongoDB Error]', err));

const serverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ip: { type: String, required: true },
  port: { type: Number, default: 443 }
}, { collection: 'Rec' });

const ServerModel = mongoose.model('Server', serverSchema);

app.get('/api/servers', async (req, res) => {
  try {
    const servers = await ServerModel.find({}, { _id: 0, __v: 0 });
    if (!servers || servers.length === 0) {
      return res.json([
        { name: "Nodo Backup Oficial", ip: "https://matchmaker.among.us", port: 443 }
      ]);
    }
    res.json(servers);
  } catch (error) {
    console.error('[API Error]', error);
    res.status(500).json({ error: 'Error al obtener la lista de servidores' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[API Running] Servidor escuchando en el puerto ${PORT}`);
});
