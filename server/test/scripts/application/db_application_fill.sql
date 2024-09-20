SET FOREIGN_KEY_CHECKS = 0;

--
-- Daten für Tabelle `generation`
--
INSERT INTO `generation` (`generationID`, `bezeichnung`, `bewerbung_start`, `bewerbung_ende`, `auswahl_WE_Termin_start`, `auswahl_WE_Termin_ende`, `ww_Termin_start`, `ww_Termin_ende`, `infoabendBesucher`, `tuercode`, `wahl_start`, `wahl_ende`) VALUES
(3, 'Wintersemester 13/14', '2013-10-28 20:00:00', '2013-10-30 20:00:00', '2013-11-01', '2013-11-03', '2013-11-15', '2013-11-17', 95, '456789', NULL, NULL),
(4, 'Sommersemester 2014', '2014-04-11 14:00:00', '2014-04-16 20:00:00', '2014-04-25', '2014-04-27', '2014-05-02', '2014-05-04', 65, '614753', '2014-05-05 00:00:00', '2014-05-07 19:00:00'),
(5, 'Wintersemester 14/15', '2014-10-26 22:00:00', '2014-10-29 18:00:00', '2014-10-31', '2014-11-02', '2014-11-14', '2014-11-16', NULL, '157456', '2014-11-16 18:00:00', '2014-11-19 13:30:00'),
(6, 'Sommersemester 2015', '2015-04-20 19:15:00', '2015-04-22 19:00:00', '2015-04-24', '2015-04-26', '2015-05-01', '2015-05-04', 29, '971023', '2015-05-04 13:00:00', '2015-05-06 18:00:00'),
(7, 'Wintersemester 15/16', '2015-10-26 19:00:00', '2015-10-28 20:00:00', '2015-10-30', '2015-11-01', '2015-11-13', '2015-11-15', 204, '974651', '2015-11-15 20:30:00', '2015-11-18 18:00:00'),
(8, 'Sommersemester 2016', '2016-04-18 19:00:00', '2016-04-20 20:00:00', '2016-04-22', '2016-04-24', '2016-05-06', '2016-05-08', 46, '351473', '2016-05-08 18:25:00', '2016-05-11 18:00:00'),
(9, 'Wintersemester 16/17', '2016-10-26 21:00:00', '2016-11-01 01:30:00', '2016-11-04', '2016-11-06', '2016-11-18', '2016-11-20', NULL, '765423', '2016-11-20 22:00:00', '2016-11-23 13:00:00'),
(10, 'Sommersemester 2017', '2017-04-24 20:00:00', '2017-04-27 14:15:00', '2017-04-28', '2017-04-30', '2017-05-05', '2017-05-07', NULL, '845745', '2017-05-08 14:00:00', '2017-05-10 15:00:00'),
(11, 'Wintersemester 17/18', '2017-10-17 18:00:00', '2017-10-29 18:00:00', '2017-11-03', '2017-11-05', '2017-11-10', '2017-11-12', 151, '378495', '2017-11-13 13:30:00', '2017-11-15 19:00:00'),
(12, 'Sommersemester 2018', '2018-04-16 11:30:00', '2018-04-19 00:01:00', '2018-04-20', '2018-04-22', '2018-04-27', '2018-04-29', NULL, '517895', '2018-04-30 22:00:00', '2018-05-02 20:00:00'),
(13, 'Wintersemester 18/19', '2018-10-29 22:00:00', '2018-11-05 23:59:00', '2018-11-09', '2018-11-11', '2018-11-16', '2018-11-18', 95, '687452', '2018-11-19 00:00:00', '2018-11-21 16:00:00'),
(14, 'Sommersemester 2019', '2019-04-15 21:00:00', '2019-04-19 23:59:00', '2019-04-26', '2019-04-28', '2019-05-03', '2019-05-05', 38, '657468', '2019-05-07 12:00:00', '2019-05-09 20:00:00'),
(15, 'Wintersemester 19/20', '2019-10-28 18:00:00', '2019-11-02 20:10:00', '2019-11-08', '2019-11-10', '2019-11-15', '2019-11-17', 107, '000000', '2019-11-17 23:59:00', '2019-11-20 19:30:00');

--
-- Daten für Tabelle `traineebewerber`
--

INSERT INTO `traineebewerber` (`traineebewerberID`, `generation`, `eingangsdatum`, `eingeladen`, `aufnehmen`, `aufgenommen`, `vorname`, `nachname`, `bild`, `geburtsdatum`, `handy`, `festnetz`, `email`, `heimatAdr_Strasse`, `heimatAdr_Nr`, `heimatAdr_PLZ`, `heimatAdr_Ort`, `studienAdr_Strasse`, `studienAdr_Nr`, `studienAdr_PLZ`, `studienAdr_Ort`, `studium_Abschluss`, `studium_Hochschule`, `studium_Fach`, `studium_SonstigesFach`, `studium_Beginn`, `studium_Fachsemester`, `studium_1Vertiefung`, `studium_2Vertiefung`, `studium_3Vertiefung`, `studium_BachelorFach`, `studium_BachelorHochschule`, `berufsausbildung_Beruf`, `berufsausbildung_Unternehmen`, `berufsausbildung_Ort`, `berufsausbildung_Beginn`, `berufsausbildung_Ende`, `beruf_Taetigkeit`, `beruf_Unternehmen`, `beruf_Ort`, `beruf_Beginn`, `beruf_Ende`, `edv`, `hobbies`, `zeit`, `motivation`, `radiovalue1`, `radiovalue2`, `radiovalue3`, `radiovalue4`, `radiovalue5`, `radiovalue6`, `radiovalue7`, `radiovalue8`, `flyer`, `plakate`, `vorlesungen`, `freunde`, `internet`, `sonstiges`, `sonstigesText`, `workingWeekend`, `verfuegbarkeitAuswahlWE`, `socialmedia`, `campusrallye`, `partner`, `geschlecht`, `newsletter`, `infostand`) VALUES 
(1, 15, '2024-09-19 17:16:58.000000', '0', '0', NULL, 'Michael', 'Scott ', 'png', '1965-03-15', '01234546789', NULL, 'michael.scott@dunder-mifflin.com', 'heimatstr', '1', '12345', 'Heimatort', 'Studienstr', '2', '98765', 'Studienort', 'Bachelor', 'Universität Hohenheim', 'Wirtschaftswissenschaften', NULL, '2023-08-18 00:00:00.000', '99', '1. Vertiefung', '2. Vertiefung', NULL, NULL, NULL, 'Ausbildungsberuf ', 'Ausbildungsunternehmen', 'Ausbildungsort', '2015-09-18 00:00:00.000', '2017-09-18 00:00:00.000', 'Berufliche Tätigkeit', 'Berufsunternehmen', 'Berufsort', '2017-05-18 00:00:00.000', '2018-04-18 00:00:00.000', NULL, 'Hobbies', 'Zeitliche Verfügbarkeit', 'Motivation', '1', '2', '3', '4', '5', '6', '7', '1', '1', '0', '0', '0', '0', '0', '', '0', 'nichtFR', '1', '0', '0', 'männlich', '0', '0'),
(2, 15, '2024-09-19 17:16:58.000000', '0', '0', NULL, 'Jim', 'Halpert', 'png', '1978-10-01', '0987654321', NULL, 'jim.halpert@dunder-mifflin.com', 'scrantonstr', '4', '54321', 'Scranton', 'uniweg', '9', '67890', 'Uniort', 'Bachelor', 'Universität Scranton', 'Betriebswirtschaftslehre', NULL, '2022-07-10 00:00:00.000', '95', 'Marketing', 'Personalwesen', NULL, NULL, NULL, 'Ausbildungsberuf ', 'Dunder Mifflin', 'Scranton', '2010-06-01 00:00:00.000', '2013-06-01 00:00:00.000', 'Verkaufsleiter', 'Dunder Mifflin', 'Scranton', '2014-05-15 00:00:00.000', '2022-07-10 00:00:00.000', NULL, 'Basketball, Pranks', 'Montags bis Freitags', 'Erfolg im Vertrieb', '1', '2', '3', '4', '5', '6', '7', '1', '1', '1', '1', '1', '1', '1', 'TMS', '1', 'nichtSO', '1', '1', '1', 'männlich', '1', '1'),
(3, 15, '2024-09-19 17:16:58.000000', '0', '0', NULL, 'Pam', 'Beesly', 'png', '1979-03-25', '0987654322', NULL, 'pam.beesly@dunder-mifflin.com', 'kunststr', '12', '54322', 'Scranton', 'uniweg', '11', '67891', 'Uniort', 'Bachelor', 'Kunsthochschule Scranton', 'Grafikdesign', NULL, '2022-07-10 00:00:00.000', '90', 'Design', 'Kunst', NULL, NULL, NULL, 'Ausbildungsberuf ', 'Dunder Mifflin', 'Scranton', '2010-06-01 00:00:00.000', '2013-06-01 00:00:00.000', 'Büroassistentin', 'Dunder Mifflin', 'Scranton', '2014-05-15 00:00:00.000', '2022-07-10 00:00:00.000', NULL, 'Kunst, Yoga', 'Montags bis Freitags', 'Kreativität', '1', '2', '3', '4', '5', '6', '7', '1', '0', '0', '1', '0', '0', '1', 'TV Werbung', '1', 'nichtSA', '1', '1', '1', 'weiblich', '0', '0'),
(4, 15, '2024-09-19 17:16:58.000000', '0', '0', NULL, 'Dwight', 'Schrute', 'png', '1970-01-20', '0987654323', NULL, 'dwight.schrute@dunder-mifflin.com', 'beetfarmstr', '5', '54323', 'Scranton', 'uniweg', '13', '67892', 'Uniort', 'Bachelor', 'Schrute Farms Academy', 'Landwirtschaft', NULL, '2021-05-18 00:00:00.000', '100', 'Verkauf', 'Landwirtschaft', NULL, NULL, NULL, 'Ausbildungsberuf ', 'Schrute Farms', 'Scranton', '1995-05-18 00:00:00.000', '2000-09-18 00:00:00.000', 'Assistenz Regionalmanager', 'Dunder Mifflin', 'Scranton', '2001-04-18 00:00:00.000', '2022-07-10 00:00:00.000', NULL, 'Karate, Schrute Farms', '24/7', 'Unbeugsamkeit', '1', '2', '3', '4', '5', '6', '7', '1', '0', '1', '0', '0', '1', '0', '', '1', 'kannImmer', '1', '0', '0', 'männlich', '1', '1'),
(5, 15, '2024-09-19 17:16:58.000000', '0', '0', NULL, 'Stanley', 'Hudson', 'png', '1958-08-14', '0987654324', NULL, 'stanley.hudson@dunder-mifflin.com', 'dundermifflinstr', '8', '54324', 'Scranton', 'uniweg', '15', '67893', 'Uniort', 'Bachelor', 'Scranton Business School', 'Vertrieb', NULL, '2023-08-18 00:00:00.000', '85', 'Vertrieb', 'Business', NULL, NULL, NULL, 'Ausbildungsberuf ', 'Dunder Mifflin', 'Scranton', '1985-09-18 00:00:00.000', '1990-09-18 00:00:00.000', 'Vertriebsmitarbeiter', 'Dunder Mifflin', 'Scranton', '1991-05-18 00:00:00.000', '2023-08-18 00:00:00.000', NULL, 'Kreuzworträtsel, Schlafen', 'Montags bis Freitags', 'Ruhestand', '1', '2', '3', '4', '5', '6', '7', '1', '0', '0', '0', '0', '0', '0', '', '1', 'nichtFR', '0', '0', '0', 'männlich', '0', '0'),
(6, 15, '2024-09-19 17:16:58.000000', '0', '0', NULL, 'Creed', 'Bratton', 'png', '1943-11-01', '0987654325', NULL, 'creed.bratton@dunder-mifflin.com', 'mysteriöserstr', '99', '54325', 'Unbekannt', 'uniweg', '99', '67894', 'Uniort', 'Master', 'Unbekannte Universität', 'Unbekanntes Fachgebiet', NULL, '2020-09-30 00:00:00.000', '65', 'Mysteriöse Kenntnisse', 'Kriminalität', NULL, NULL, NULL, 'Ausbildungsberuf ', 'Dunder Mifflin', 'Scranton', 'Unbekannt', 'Unbekannt', 'Qualitätsmanager', 'Dunder Mifflin', 'Scranton', '2000-10-10 00:00:00.000', '2022-07-10 00:00:00.000', NULL, 'Gitarre spielen, Verbrechen', 'Montags bis Freitags', 'Rätselhaftigkeit', '1', '2', '3', '4', '5', '6', '7', '1', '0', '0', '0', '0', '1', '1', 'Werbung auf U-Bahn', '1', 'nichtFR', '0', '0', '0', 'männlich', '0', '1');

--
-- Daten für Tabelle `traineebewerber_bewertung`
--
INSERT INTO `traineebewerber_bewertung` (`traineebewerber_traineebewerberID`, `mitglied_mitgliedID`, `bewertung`) VALUES 
(1, 8324, 0),
(2, 8324, 1),
(3, 8324, 2),
(4, 8324, 3),
(5, 8324, 2),
(6, 8324, 1);

--
-- Daten für Tabelle `traineebewerber_ehrenamtlichschule`
--
INSERT INTO `traineebewerber_ehrenamtlichschule` (`id`,`traineebewerberID`, `taetigkeit`) VALUES 
(1, 1, 'Ehrenamt Schule');

--
-- Daten für Tabelle `traineebewerber_ehrenamtlichstudium`
--
INSERT INTO `traineebewerber_ehrenamtlichstudium` (`traineebewerberID`, `taetigkeit`) VALUES 
(1, 'Ehrenamt Studium');

--
-- Daten für Tabelle `traineebewerber_hiwi`
--
INSERT INTO `traineebewerber_hiwi` (`traineebewerberID`, `taetigkeit`, `unternehmen`, `ort`, `beginn`, `ende`) VALUES 
( 1, 'Hiwi taetigkeit', 'Hiwi unternehmen', 'Hiwi ort', '2019-05-18 00:00:00.000', '2020-06-18 00:00:00.000');

--
-- Daten für Tabelle `traineebewerber_praktikum`
--
INSERT INTO `traineebewerber_praktikum` ( `traineebewerberID`, `taetigkeit`, `unternehmen`, `ort`, `beginn`, `ende`) VALUES 
(1, 'Praktikum taetigkeit', 'Praktikum unternehmen', 'Praktikum ort', '2019-05-18 00:00:00.000', '2020-06-18 00:00:00.000');

--
-- Daten für Tabelle `traineebewerber_itskill`
--
INSERT INTO `traineebewerber_itskill` (`traineebewerberID`, `itskill`, `level`) VALUES
(1, 'Java', 3);

--
-- Daten für Tabelle `traineebewerber_sprache`
--
INSERT INTO `traineebewerber_sprache` ( `traineebewerberID`, `sprache`, `sprachlevel`) VALUES 
(1, 'Deutsch', 3);

