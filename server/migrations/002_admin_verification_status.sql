ALTER TABLE company_profiles
  ADD COLUMN verification_status ENUM('pending', 'verified', 'rejected') NOT NULL DEFAULT 'pending' AFTER verified,
  ADD KEY idx_company_profiles_verification (verification_status);

UPDATE company_profiles
SET verification_status = 'verified'
WHERE verified = TRUE;

ALTER TABLE student_profiles
  ADD COLUMN verification_status ENUM('pending', 'verified', 'rejected') NOT NULL DEFAULT 'pending' AFTER resume_file_id,
  ADD KEY idx_student_profiles_verification (verification_status);
