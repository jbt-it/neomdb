import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("traceID_UNIQUE", ["traceId"], { unique: true })
@Entity("trace", { schema: "mdb" })
export class Trace {
  @PrimaryGeneratedColumn({ type: "int", name: "traceID" })
  traceId: number;

  @Column("datetime", { name: "aenderungszeitpunkt" })
  dateOfChange: Date;

  @Column("varchar", { name: "aktion", length: 150 })
  action: string;

  @Column("varchar", { name: "benutzer", length: 45 })
  user: string;

  @Column("text", { name: "tabelle" })
  table: string;

  @Column("int", { name: "geaenderteID" })
  changedId: number;
}
