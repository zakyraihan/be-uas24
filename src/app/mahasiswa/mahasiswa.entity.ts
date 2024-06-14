import { Max } from 'class-validator';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Jurusan } from '../jurusan/jurusan.entity';
import { Ruangan } from '../ruangan/ruangan.entity';

@Entity()
export class Mahasiswa extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  foto_mahasiswa: string;

  @Column({ nullable: false })
  nama_mahasiswa: string;

  @Column({ nullable: false })
  umur: number;

  @Column({ nullable: false })
  asal: string;

  @Column({ nullable: false })
  tanggal_lahir: string;

  @Column({ nullable: false })
  alamat: string;

  @Column({ nullable: false })
  nama_ortu: string;

  @Column({ nullable: false })
  nim: number;

  @ManyToOne(() => Jurusan, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'jurusan_id' })
  jurusan: Jurusan;

  @ManyToOne(() => Ruangan, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'ruangan_id' })
  ruangan: Ruangan;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
