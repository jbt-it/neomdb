import { In, Not } from "typeorm";
import { AppDataSource } from "../../datasource";
import { Department } from "../../entities/Department";

export const DepartmentRepository = AppDataSource.getRepository(Department).extend({
  /**
   * Retrieves all departments as a list
   * @returns A list of departments
   */
  getDepartments(): Promise<Department[]> {
    return this.find({ where: { departmentId: Not(8) }, order: { departmentId: "ASC" } });
  },

  /**
   * Retrieves a department by its id
   * @param departmentId The id of the department
   * @returns The department or null if no department was found
   */
  getDepartmentById(departmentId: number): Promise<Department | null> {
    return this.findOne({ where: { departmentId } });
  },

  /**
   * Retrieves a department by its id
   * @param departmentId The id of the department
   * @returns The department or null if no department was found
   */
  saveDepartment(department: Department): Promise<Department> {
    return this.save(department);
  },

  /**
   * Retrieves departments by their directorIds
   * @param roles The directorIds of the departments
   * @returns A list of departments
   */
  getDepartmentsByRoles(roles: number[]): Promise<Department[]> {
    return this.find({
      relation: ["director"],
      where: {
        director: {
          directorId: In(roles),
        },
      },
    });
  },
});
