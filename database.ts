import type { Nota, NotaFormulario } from '@/types';
import * as SQLite from 'expo-sqlite';
 
const db = SQLite.openDatabaseSync('notafacil.db');
 
export function initDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS notas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricaoProduto TEXT NOT NULL,
      dataCompra TEXT,
      tempoGarantiaMeses INTEGER,
      loja TEXT,
      assistenciaTecnica TEXT
    );
  `);
}
export function inserirNota(nota: NotaFormulario) {
    db.runSync(
      `INSERT INTO notas
       (descricaoProduto, dataCompra,
        tempoGarantiaMeses, loja,
        assistenciaTecnica)
       VALUES (?, ?, ?, ?, ?);`,
      [nota.descricaoProduto, nota.dataCompra,
       nota.tempoGarantiaMeses, nota.loja,
       nota.assistenciaTecnica]
    );
  }

  export function buscarNotas(): Nota[] {
    return db.getAllSync<Nota>(
      `SELECT * FROM notas
       ORDER BY id DESC;`
    );
  }

  export function buscarNotaPorId(id: number): Nota | null {
    return db.getFirstSync<Nota>(
      'SELECT * FROM notas WHERE id = ?;', [id]
    );
  }
   
  export function atualizarNota(id: number, nota: NotaFormulario) {
    db.runSync(
      `UPDATE notas SET
         descricaoProduto = ?, dataCompra = ?,
         tempoGarantiaMeses = ?, loja = ?,
         assistenciaTecnica = ?
       WHERE id = ?;`,
      [nota.descricaoProduto, nota.dataCompra, nota.tempoGarantiaMeses,
       nota.loja, nota.assistenciaTecnica, id]
    );
  }
  
  
  

