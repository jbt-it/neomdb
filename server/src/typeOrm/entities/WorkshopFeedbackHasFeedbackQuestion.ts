import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { FeedbackQuestion } from "./FeedbackQuestion";
import { WorkshopFeedback } from "./WorkshopFeedback";

@Index("fk_schulungsfeedback_has_feedbackfrage_feedbackfrage1", ["feedbackQuestionId"], {})
@Index("fk_schulungsfeedback_has_feedbackfrage_schulungsfeedback1", ["workshopFeedbackId"], {})
@Entity("schulungsfeedback_has_feedbackfrage", { schema: "mdb" })
export class WorkshopFeedbackHasFeedbackQuestion {
  @Column("int", {
    primary: true,
    name: "schulungsfeedback_schulungsfeedbackID",
  })
  workshopFeedbackId: number;

  @Column("int", { primary: true, name: "feedbackfrage_feedbackfrageID" })
  feedbackQuestionId: number;

  @Column("int", { name: "note", nullable: true })
  grade: number | null;

  @ManyToOne(() => FeedbackQuestion, (feedbackQuestion) => feedbackQuestion.workshopFeedbackHasFeedbackQuestions, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    {
      name: "feedbackfrage_feedbackfrageID",
      referencedColumnName: "feedbackQuestionId",
    },
  ])
  feedbackQuestion: FeedbackQuestion;

  @ManyToOne(() => WorkshopFeedback, (workshopFeedback) => workshopFeedback.workshopFeedbackHasFeedbackQuestions, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    {
      name: "schulungsfeedback_schulungsfeedbackID",
      referencedColumnName: "workshopFeedbackId",
    },
  ])
  workshopFeedback: WorkshopFeedback;
}
