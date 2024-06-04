import { Column, Entity } from "typeorm";

@Entity("projekt_has_akquisekanal", { schema: "mdb" })
export class ProjektHasAkquisekanal {
  @Column("int", { primary: true, name: "projekt_projektID" })
  projektProjektId: number;

  @Column("int", { primary: true, name: "akquisekanal_akquisekanalID" })
  akquisekanalAkquisekanalId: number;
}
