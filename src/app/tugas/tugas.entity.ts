import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Jurusan } from '../jurusan/jurusan.entity';
import { UserKuliah } from '../auth/auth.entity';

@Entity()
export class Tugas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => Jurusan, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'jurusan_id' })
  jurusan: Jurusan;

  @Column()
  gambar: string;

  @Column()
  jumlah: number;

  @Column()
  status: string;

  @Column('text')
  description: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => UserKuliah, (UserKuliah) => UserKuliah.tugas_updated_by)
  @JoinColumn({ name: 'updated_by_mahasiswa' }) //buat relasi many to one  dengan table user
  updated_by_mahasiswa: UserKuliah;
}
