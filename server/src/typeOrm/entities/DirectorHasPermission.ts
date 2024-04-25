import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Permission } from "./Permission";
import { Director } from "./Director";

@Index("fk_evposten_has_berechtigung_berechtigung_idx", ["permissionId"], {})
@Entity("evposten_has_berechtigung", { schema: "mdb" })
export class DirectorHasPermission {
  @Column("int", { primary: true, name: "evposten_evpostenID" })
  directorId: number;

  @Column("int", { primary: true, name: "berechtigung_berechtigungID" })
  permissionId: number;

  @Column("tinyint", { name: "canDelegate", width: 1 })
  canDelegate: boolean;

  @ManyToOne(() => Permission, (permission) => permission.directorHasPermissions, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    {
      name: "berechtigung_berechtigungID",
      referencedColumnName: "permissionId",
    },
  ])
  permission: Permission;

  @ManyToOne(() => Director, (director) => director.directorHasPermissions, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "evposten_evpostenID", referencedColumnName: "directorId" }])
  director: Director;
}
