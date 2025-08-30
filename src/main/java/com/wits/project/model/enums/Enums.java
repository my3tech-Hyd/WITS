package com.wits.project.model.enums;

public final class Enums {
    private Enums() {}

    public enum UserRole { JOB_SEEKER, EMPLOYER, STAFF, PROVIDER }

    public enum ApplicationStatus { RECEIVED, UNDER_REVIEW, INTERVIEW_SCHEDULED, OFFERED, REJECTED, WITHDRAWN }

    public enum JobType { FULL_TIME, PART_TIME, CONTRACT, TEMPORARY, INTERN, APPRENTICESHIP }

    public enum JobStatus { ACTIVE, INACTIVE, HOLD }

    public enum AppointmentType { CAREER_COUNSELING, SKILLS_ASSESSMENT, JOB_FAIR, WORKSHOP, OTHER }

    public enum NotificationType { JOB_MATCH, DEADLINE, PROFILE_ALERT, VETERAN_RESOURCE, SYSTEM }

    public enum DocumentStatus { SUBMITTED, APPROVED, REJECTED, RESUBMIT_REQUESTED }

    public enum ProgramType { SNAP_ENT, WT_TANF, WIOA, OTHER }

    public enum CaseStatus { OPEN, IN_PROGRESS, ON_HOLD, CLOSED }
}


