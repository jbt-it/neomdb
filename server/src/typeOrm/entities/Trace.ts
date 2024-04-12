import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("traceID_UNIQUE", ["traceId"], { unique: true })
@Entity("trace", { schema: "mdb" })
export class Trace {
  @PrimaryGeneratedColumn({ type: "int", name: "traceID" })
  traceId: number;

  @Column("datetime", { name: "aenderungszeitpunkt" })
  aenderungszeitpunkt: Date;

  @Column("varchar", { name: "aktion", length: 150 })
  aktion: string;

  @Column("varchar", { name: "benutzer", length: 45 })
  benutzer: string;

  @Column("text", { name: "tabelle" })
  tabelle: string;

  @Column("int", { name: "geaenderteID" })
  geaenderteId: number;
}
