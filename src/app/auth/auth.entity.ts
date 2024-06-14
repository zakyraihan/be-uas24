import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { ResetPassword } from './reset_password.entity';
import { JadwalKuliah } from '../jadwal-kuliah/jadwal-kuliah.entity';
import { Diskusi } from '../diskusi/diskusi.entity';
import { Tugas } from '../tugas/tugas.entity';

@Entity()
export class UserKuliah extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nama: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  refresh_token: string;

  @Column({ nullable: false })
  role: string;

  @OneToMany(() => ResetPassword, (reset) => reset.user) // buat relasi one to many dengan tabel reset password
  reset_password: ResetPassword;

  @OneToMany(() => JadwalKuliah, (JadwalKuliah) => JadwalKuliah.dosen)
  jadwal_created_by: JadwalKuliah[];

  @OneToMany(() => Diskusi, (Diskusi) => Diskusi.user)
  diskusi_created_by: Diskusi[];

  @OneToMany(() => Tugas, (tugas) => tugas.updated_by_mahasiswa)
  tugas_updated_by: Tugas[];

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
