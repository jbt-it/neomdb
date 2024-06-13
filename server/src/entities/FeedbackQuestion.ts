import { Column, Entity, OneToMany } from "typeorm";
import { WorkshopFeedbackHasFeedbackQuestion } from "./WorkshopFeedbackHasFeedbackQuestion";

@Entity("feedbackfrage", { schema: "mdb" })
export class FeedbackQuestion {
  @Column("int", { primary: true, name: "feedbackfrageID" })
  feedbackQuestionId: number;

  @Column("varchar", { name: "frage", nullable: true, length: 200 })
  question: string | null;

  @OneToMany(
    () => WorkshopFeedbackHasFeedbackQuestion,
    (workshopFeedbackHasFeedbackQuestions) => workshopFeedbackHasFeedbackQuestions.feedbackQuestion
  )
  workshopFeedbackHasFeedbackQuestions: WorkshopFeedbackHasFeedbackQuestion[];
}
