import { Column, Entity } from "typeorm";

@Entity("hilfetext", { schema: "mdb" })
export class HelpText {
  @Column("varchar", { primary: true, name: "hilfetextID", length: 255 })
  helpTextId: string;

  @Column("tinyint", { name: "editable", width: 1, default: () => "'1'" })
  editable: boolean;

  @Column("longtext", { name: "text" })
  text: string;
}
