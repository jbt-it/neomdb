import { AppDataSource } from "../datasource";
import { Trace } from "../entities/Trace";
import { EntitySubscriberInterface, EventSubscriber, UpdateEvent } from "typeorm";
import { Context } from "./Context";

/**
 * The update subscriber listenes to updates made to entites and automatically creates an entry in the trace table.
 */
@EventSubscriber()
export class UpdateSubscriber implements EntitySubscriberInterface<any> {
  /**
   * A list of entity names that specify for which entites a trace entry should be created.
   */
  private entitiesToTrack = ["Member", "Project", "Department", "Company"];

  /**
   * A dictionary that maps entity names to the name of the property that holds the id of the entity.
   */
  private entityIdsToTrack = {
    Member: "memberId",
    Project: "projectId",
    Department: "departmentId",
    Company: "companyId",
  };

  /**
   * Specifies to which class of an entity the subscriber listens to.
   * ´null´ indicates, that every entity class is listened to.
   * @returns
   */
  public listenTo() {
    return null;
  }

  /**
   * Constructs a string that describes the action that was performed on the entity.
   * @param columns The columns that were updated.
   * @returns A string that describes the action that was performed on the entity.
   */
  private createActionText(columns: any[]) {
    let actionText = `Changed `;

    columns.forEach((column, index) => {
      // If the action text is too long, add a message that there are more columns that were changed.
      if (actionText.length + column.propertyName.length >= 220) {
        actionText += `and ${columns.length - index} more columns.`;
        return;
      }
      // If the column is the first one, add the column name to the action text without a comma.
      if (index === 0) {
        actionText += `${column.propertyName}`;
        return;
      }
      // If the column is the last one, add the column name to the action text and add a dot at the end.
      if (index === columns.length - 1) {
        actionText += ` and ${column.propertyName}`;
        return;
      }
      // If the column is not the first or the last one, add the column name to the action text with a comma.
      actionText += `, ${column.propertyName}`;
    });

    return actionText;
  }

  /**
   * Triggers before the update of every entity and creates an entry in the trace table to track important updates.
   * @param event The update event that is listened to and which holds metadata about the update.
   */
  public beforeUpdate(event: UpdateEvent<any>): void | Promise<void> {
    if (this.entitiesToTrack.includes(event.metadata.name)) {
      const traceRepository = AppDataSource.getRepository(Trace);

      // Gets the current user from the context
      const user = Context.getUser();

      const actionText = this.createActionText(event.updatedColumns);

      // Create new trace entity
      const trace = new Trace();
      trace.dateOfChange = new Date();
      trace.table = event.metadata.name;
      trace.changedId = event.entity[this.entityIdsToTrack[event.metadata.name]];
      trace.action = actionText;
      trace.user = user.name;

      // Save trace entity
      traceRepository.save(trace);
    }
  }
}
