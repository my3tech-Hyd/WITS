package com.wits.project.model.enums;

public final class Enums {
    private Enums() {}

    public enum UserRole { JOB_SEEKER, EMPLOYER, STAFF, PROVIDER }

    public enum JobApplicationStatus { RECEIVED, UNDER_REVIEW, INTERVIEW_SCHEDULED, OFFERED, REJECTED, WITHDRAWN }

    public enum JobType { FULL_TIME, PART_TIME, CONTRACT, TEMPORARY, INTERN, APPRENTICESHIP }

    public enum JobStatus { ACTIVE, INACTIVE, HOLD }

    public enum AppointmentType { CAREER_COUNSELING, SKILLS_ASSESSMENT, JOB_FAIR, WORKSHOP, OTHER }

    public enum NotificationType { JOB_MATCH, DEADLINE, PROFILE_ALERT, VETERAN_RESOURCE, SYSTEM }

    public enum DocumentStatus { SUBMITTED, APPROVED, REJECTED, RESUBMIT_REQUESTED }
 
    public enum ProgramType { SNAP_ENT, WT_TANF, WIOA, RESUME, COVER_LETTER, PROFILE_PICTURE, OTHER }

    public enum CaseStatus { OPEN, IN_PROGRESS, ON_HOLD, CLOSED }

    public enum ServiceStatus { ACTIVE, INACTIVE, DRAFT }

    public enum ServiceMode { ONLINE, OFFLINE, HYBRID }

    public enum ServiceCategory { IT, FINANCE, MANAGEMENT, TECHNICAL, HEALTHCARE, EDUCATION, CONSULTING, OTHER }

    public enum ServiceApplicationStatus { PENDING, ACCEPTED, REJECTED, WITHDRAWN, JOIN, NOT_INTERESTED }

    public enum MessageType { TEXT, SYSTEM, NOTIFICATION }

    public enum OrganizationType { TRAINING_INSTITUTE, CONSULTANCY, SERVICE_PROVIDER, EDUCATIONAL_INSTITUTION, OTHER }


}


