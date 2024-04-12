import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DirectorHasPermission } from "./DirectorHasPermission";
import { Member } from "./Member";

@Index("berechtigungID_UNIQUE", ["permissionId"], { unique: true })
@Index("bezeichnung_UNIQUE", ["designation"], { unique: true })
@Entity("berechtigung", { schema: "mdb" })
export class Permission {
  @PrimaryGeneratedColumn({ type: "int", name: "berechtigungID" })
  permissionId: number;

  @Column("varchar", { name: "bezeichnung", unique: true, length: 45 })
  designation: string;

  @Column("mediumtext", { name: "beschreibung", nullable: true })
  description: string | null;

  @OneToMany(() => DirectorHasPermission, (directorHasPermissions) => directorHasPermissions.permission)
  directorHasPermissions: DirectorHasPermission[];

  @ManyToMany(() => Member, (member) => member.permissions)
  @JoinTable({
    name: "mitglied_has_berechtigung",
    joinColumns: [
      {
        name: "berechtigung_berechtigungID",
        referencedColumnName: "permissionId",
      },
    ],
    inverseJoinColumns: [{ name: "mitglied_mitgliedID", referencedColumnName: "memberId" }],
    schema: "mdb",
  })
  members: Member[];
}
