SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE mdb_test.mitglied;
TRUNCATE TABLE mdb_test.ressort;
TRUNCATE TABLE mdb_test.sprachen;
TRUNCATE TABLE mdb_test.edvkenntnisse;
TRUNCATE TABLE mdb_test.mitglied_has_evposten;
TRUNCATE TABLE mdb_test.evposten;
TRUNCATE TABLE mdb_test.mitglied_has_berechtigung;
TRUNCATE TABLE mdb_test.generation;
TRUNCATE TABLE mdb_test.internesprojekt;
TRUNCATE TABLE mdb_test.internesprojekt_has_qm;
TRUNCATE TABLE mdb_test.generation_has_mentor;
SET FOREIGN_KEY_CHECKS = 1;