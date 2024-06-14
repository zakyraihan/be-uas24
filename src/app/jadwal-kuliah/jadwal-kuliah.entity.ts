import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserKuliah } from '../auth/auth.entity';
import { Jurusan } from '../jurusan/jurusan.entity';
import { Ruangan } from '../ruangan/ruangan.entity';

@Entity()
export class JadwalKuliah extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  mata_kuliah: string;

  @Column({ nullable: false })
  hari: string;

  @ManyToOne(() => UserKuliah)
  @JoinColumn({ name: 'created_by' })
  dosen: UserKuliah;

  @Column({ nullable: false })
  waktuMulai: string;

  @Column({ nullable: false })
  waktuSelesai: string;

  @ManyToOne(() => Ruangan, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'ruangan_id' })
  ruang_kuliah: Ruangan;

  @ManyToOne(() => Jurusan, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'jurusan_id' })
  jurusan: Jurusan;

  @ManyToOne(() => UserKuliah)
  @JoinColumn({ name: 'updated_by' })
  updated_by: UserKuliah;
}
