export default function merge(message, replies) {
  // Objek untuk menyimpan relasi parent id dengan children dalam bentuk objek
  const mappedChildArray = {};

  // Iterasi array kedua untuk memetakan children ke parent id yang sesuai
  for (const { reply_id, message_id, reply, created_at } of replies) {
    const pId = message_id.length === 1 ? message_id[0] : null; // Ambil parentId dari array jika hanya berisi satu data
    if (pId !== null) {
      if (!mappedChildArray[pId]) {
        mappedChildArray[pId] = [];
      }
      mappedChildArray[pId].push({ reply_id, reply, created_at });
    }
  }

  // Gabungkan properti children menjadi array berdasarkan parentId
  const resultArray = message.map((data) => ({
    data,
    children: mappedChildArray[data.message_id] || [],
  }));

  return resultArray;
}
