import { EntitySubscriberInterface, EventSubscriber, UpdateEvent } from "typeorm";
import { AppDataSource } from "../datasource";
import { Trace } from "../entities/Trace";
import { Context } from "./Context";

/**
 * The change subscriber listenes to updates/deletes made to entites and automatically creates an entry in the trace table.
 */
@EventSubscriber()
export class ChangeSubscriber implements EntitySubscriberInterface<any> {
  /**
   * A list of entity names that specify for which entites a trace entry should be created.
   */
  private entitiesToTrack = ["Member", "Project", "Department", "Company", "eventId"];

  /**
   * A dictionary that maps entity names to the name of the property that holds the id of the entity.
   */
  private entityIdsToTrack = {
    Member: "memberId",
    Project: "projectId",
    Department: "departmentId",
    Company: "companyId",
    Event: "eventId",
  };

  /**
   * Specifies to which class of an entity the subscriber listens to.
   * ´null´ indicates, that every entity class is listened to.
   * @returns null
   */
  public listenTo() {
    return null;
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
      const entityIdToTrack = this.entityIdsToTrack[event.metadata.name]; // Get the name of the property that holds the id of the entity
      const actionText = `Changed ${event.metadata.name.toLowerCase()}.`; // Construct the action text

      // Create new trace entity
      const trace = new Trace();
      trace.dateOfChange = new Date();
      trace.table = event.metadata.name;
      trace.changedId = event.entity[entityIdToTrack];
      trace.action = actionText;
      trace.user = user.name;

      // Save trace entity
      traceRepository.save(trace);
    }
  }

  /**
   * Triggers before the delete of every entity and creates an entry in the trace table to track important updates.
   * @param event The update event that is listened to and which holds metadata about the update.
   */
  public beforeRemove(event: UpdateEvent<any>): void | Promise<void> {
    if (this.entitiesToTrack.includes(event.metadata.name)) {
      const traceRepository = AppDataSource.getRepository(Trace);

      // Gets the current user from the context
      const user = Context.getUser();
      const entityIdToTrack = this.entityIdsToTrack[event.metadata.name]; // Get the name of the property that holds the id of the entity
      const actionText = `Deleted ${event.metadata.name.toLowerCase()}.`; // Construct the action text

      // Create new trace entity
      const trace = new Trace();
      trace.dateOfChange = new Date();
      trace.table = event.metadata.name;
      trace.changedId = event.entity[entityIdToTrack];
      trace.action = actionText;
      trace.user = user.name;

      // Save trace entity
      traceRepository.save(trace);
    }
  }
}
