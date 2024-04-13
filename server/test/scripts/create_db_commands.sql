--
-- Datenbank: `mdb`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `akquisekanal`
--

CREATE TABLE `akquisekanal` (
  `akquisekanalID` int NOT NULL,
  `bezeichnung` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `andererposten`
--

CREATE TABLE `andererposten` (
  `andererpostenID` int NOT NULL,
  `bezeichnung_maennlich` varchar(100) NOT NULL,
  `bezeichnung_weiblich` varchar(100) NOT NULL,
  `kurzvorstellung` mediumtext NOT NULL,
  `inhalt` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `ansprechpartner`
--

CREATE TABLE `ansprechpartner` (
  `ansprechpartnerID` int NOT NULL,
  `unternehmen_unternehmenID` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `geschlecht` tinyint(1) DEFAULT NULL,
  `geburtsdatum` date DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `festnetz` varchar(20) DEFAULT NULL,
  `handy` varchar(20) DEFAULT NULL,
  `xing` varchar(200) DEFAULT NULL,
  `adresszusatz` varchar(500) DEFAULT NULL,
  `strasse` varchar(100) DEFAULT NULL,
  `plz` varchar(10) DEFAULT NULL,
  `ort` varchar(100) DEFAULT NULL,
  `persoenlicheEigenschaften` mediumtext,
  `verbleib` mediumtext,
  `wichtigkeitKontaktaufnahme` int DEFAULT NULL,
  `kontaktperson` int DEFAULT NULL,
  `erinnerung` date DEFAULT NULL,
  `erwarteBestaetigung` date DEFAULT NULL,
  `zufriedenheit` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `berechtigung`
--

CREATE TABLE `berechtigung` (
  `berechtigungID` int NOT NULL,
  `bezeichnung` varchar(45) NOT NULL,
  `beschreibung` mediumtext
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `branche`
--

CREATE TABLE `branche` (
  `brancheID` int NOT NULL,
  `bezeichnung` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `bueroraum`
--

CREATE TABLE `bueroraum` (
  `bueroraumID` int NOT NULL,
  `bezeichnung` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `edvkenntnisse`
--

CREATE TABLE `edvkenntnisse` (
  `mitglied_mitgliedID` int NOT NULL,
  `wert` varchar(150) NOT NULL,
  `niveau` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `event`
--

CREATE TABLE `event` (
  `eventID` int NOT NULL,
  `eventname` varchar(255) NOT NULL,
  `beschreibung` mediumtext NOT NULL,
  `datum` date DEFAULT NULL,
  `ende` date DEFAULT NULL,
  `startzeit` varchar(10) DEFAULT NULL,
  `endzeit` varchar(10) DEFAULT NULL,
  `ort` varchar(255) DEFAULT NULL,
  `anmeldungVon` datetime DEFAULT NULL,
  `anmeldungBis` datetime DEFAULT NULL,
  `maximaleTeilnehmer` int DEFAULT NULL,
  `jbtgoes` tinyint(1) NOT NULL DEFAULT '0',
  `ww` tinyint(1) NOT NULL DEFAULT '0',
  `netzwerk` tinyint(1) NOT NULL DEFAULT '0'
  `sonstige` tinyint(1) NOT NULL DEFAULT '0',
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `evposten`
--

CREATE TABLE `evposten` (
  `evpostenID` int NOT NULL,
  `bezeichnung_maennlich` varchar(45) NOT NULL,
  `bezeichnung_weiblich` varchar(45) NOT NULL,
  `ressortID` int DEFAULT NULL,
  `kuerzel` varchar(10) NOT NULL,
  `jbt_email` varchar(45) NOT NULL,
  `kurzvorstellung` mediumtext NOT NULL,
  `inhalt` longtext NOT NULL,
  `reihenfolge` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `evposten_has_berechtigung`
--

CREATE TABLE `evposten_has_berechtigung` (
  `evposten_evpostenID` int NOT NULL,
  `berechtigung_berechtigungID` int NOT NULL,
  `canDelegate` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `expertenwissen`
--

CREATE TABLE `expertenwissen` (
  `expertenwissenID` int NOT NULL,
  `bezeichnung` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `feedbackfrage`
--

CREATE TABLE `feedbackfrage` (
  `feedbackfrageID` int NOT NULL,
  `frage` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `generation`
--

CREATE TABLE `generation` (
  `generationID` int NOT NULL,
  `bezeichnung` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `bewerbung_start` datetime DEFAULT NULL,
  `bewerbung_ende` datetime DEFAULT NULL,
  `wwTermin` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `auswahlWETermin` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `infoabendBesucher` int DEFAULT NULL,
  `tuercode` varchar(10) DEFAULT NULL,
  `wahl_start` datetime DEFAULT NULL,
  `wahl_ende` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `generationenbeauftragter`
--

CREATE TABLE `generationenbeauftragter` (
  `generation_generationID` int NOT NULL,
  `mitglied_mitgliedID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `generation_has_mentor`
--

CREATE TABLE `generation_has_mentor` (
  `mitglied_mitgliedID` int NOT NULL,
  `generation_generationID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `hcw`
--

CREATE TABLE `hcw` (
  `hcwJahr` int NOT NULL,
  `hcwStart` date NOT NULL,
  `hcwEnde` date NOT NULL,
  `bewerbung_start` datetime NOT NULL,
  `bewerbung_ende` datetime NOT NULL,
  `angezeigte_frist` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `hcwberatung`
--

CREATE TABLE `hcwberatung` (
  `hcwberatungID` int NOT NULL,
  `jahr` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `kuerzel` varchar(10) NOT NULL,
  `datum` date DEFAULT NULL,
  `login` varchar(45) DEFAULT NULL,
  `passwort` varchar(45) DEFAULT NULL,
  `session` varchar(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `hcwbewerber`
--

CREATE TABLE `hcwbewerber` (
  `hcwbewerberID` int NOT NULL,
  `jahr` int NOT NULL,
  `eingangsdatum` datetime NOT NULL,
  `token` varchar(32) NOT NULL,
  `nachname` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `vorname` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `anrede` int NOT NULL,
  `titel` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `geburtsdatum` date NOT NULL,
  `handy` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `festnetz` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `email` varchar(65) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `strasse` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `hausnr` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `plz` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ort` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `schule_Abiturnote` decimal(10,2) DEFAULT NULL,
  `schule_Abiturtermin` varchar(45) DEFAULT NULL,
  `schule_Schule` varchar(200) DEFAULT NULL,
  `schule_Ort` varchar(160) DEFAULT NULL,
  `studium_Hochschule` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `studium_Abschluss` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `studium_Beginn` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `studium_Ende` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `studium_Fach` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `studium_Fachsemester` int DEFAULT NULL,
  `studium_StatusAbschlussarbeit` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `studium_Notenschnitt` decimal(10,2) DEFAULT NULL,
  `studium_Auslandssemester` tinyint(1) DEFAULT NULL,
  `studium_Berufsausbildung` tinyint(1) DEFAULT NULL,
  `praxis_Berufstaetigkeit` int DEFAULT NULL,
  `praxis_Praktika` int DEFAULT NULL,
  `praxis_Auslandspraktika` int DEFAULT NULL,
  `praxis_Hiwi` int DEFAULT NULL,
  `praxis_Werkstudent` int DEFAULT NULL,
  `edv_Word` int DEFAULT NULL,
  `edv_Excel` int DEFAULT NULL,
  `edv_PowerPoint` int DEFAULT NULL,
  `edv_Access` int DEFAULT NULL,
  `flyer` tinyint(1) DEFAULT NULL,
  `plakate` tinyint(1) DEFAULT NULL,
  `vorlesungen` tinyint(1) DEFAULT NULL,
  `netzwerke` tinyint(1) DEFAULT NULL,
  `karriereportale` tinyint(1) DEFAULT NULL,
  `freunde` tinyint(1) DEFAULT NULL,
  `professoren` tinyint(1) DEFAULT NULL,
  `stiftungen` tinyint(1) DEFAULT NULL,
  `charly_education` tinyint(1) DEFAULT NULL,
  `newsletter` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `hcwbewerber_anlage`
--

CREATE TABLE `hcwbewerber_anlage` (
  `hcwbewerber_hcwbewerberID` int NOT NULL,
  `anlageIndex` int NOT NULL,
  `filename` varchar(200) NOT NULL,
  `filesize` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `hcwbewerber_has_beratung`
--

CREATE TABLE `hcwbewerber_has_beratung` (
  `hcwbewerber_hcwbewerberID` int NOT NULL,
  `hcwberatung_hcwberatungID` int NOT NULL,
  `einstufung` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `hilfetext`
--

CREATE TABLE `hilfetext` (
  `hilfetextID` varchar(255) NOT NULL,
  `editable` tinyint(1) NOT NULL DEFAULT '1',
  `text` longtext NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `innovation`
--

CREATE TABLE `innovation` (
  `innovationID` int NOT NULL COMMENT 'PK',
  `autor` int NOT NULL COMMENT 'FK zur Mitgliedertabelle',
  `datum` date NOT NULL,
  `ressortBeiEinreichung` int NOT NULL,
  `titel` varchar(255) DEFAULT NULL,
  `beschreibung` longtext,
  `kurzbeschreibung` longtext,
  `ressort` int NOT NULL,
  `idee_art` varchar(45) DEFAULT NULL,
  `klassifizierung` varchar(45) DEFAULT NULL,
  `industrie` varchar(45) DEFAULT NULL,
  `anwendungsfall` longtext,
  `jbt_fit` longtext,
  `wert` longtext,
  `einzigartigkeit` longtext,
  `status` enum('eingereicht','zurückgestellt','in Bearbeitung','umgesetzt','abgelehnt') NOT NULL DEFAULT 'eingereicht',
  `notiz` longtext,
  `marktgroesse_und_moeglichkeiten_attraktiv` tinyint(1) DEFAULT NULL,
  `vorhandener_markt` tinyint(1) DEFAULT NULL,
  `technisch_umsetzbar` tinyint(1) DEFAULT NULL,
  `konkurrenz_vorhanden` tinyint(1) DEFAULT NULL,
  `anwendungsfall_plausibel` int DEFAULT NULL,
  `fuer_jbt_sinnvoll` int DEFAULT NULL,
  `wow_faktor` int DEFAULT NULL,
  `einfachheit_konzept` int DEFAULT NULL,
  `nutzen` int DEFAULT NULL,
  `zusaetzlicher_profit` int DEFAULT NULL,
  `investitionsvolumen` int DEFAULT NULL,
  `know_how` int DEFAULT NULL,
  `bedrohung_wettbewerber` int DEFAULT NULL,
  `umsetzung_schwierigkeit` int DEFAULT NULL,
  `potentialwert` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `internesprojekt`
--

CREATE TABLE `internesprojekt` (
  `internesprojektID` int NOT NULL,
  `generation` int NOT NULL,
  `projektname` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `kuerzel` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `kickoff` date DEFAULT NULL,
  `AngebotBeiEV` tinyint(1) NOT NULL DEFAULT '0',
  `ZPbeiEV` tinyint(1) NOT NULL DEFAULT '0',
  `ZPgehalten` date DEFAULT NULL,
  `APbeiEV` tinyint(1) NOT NULL DEFAULT '0',
  `APgehalten` date DEFAULT NULL,
  `DLbeiEV` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `internesprojekt_has_qm`
--

CREATE TABLE `internesprojekt_has_qm` (
  `internesprojekt_internesprojektID` int NOT NULL,
  `mitglied_mitgliedID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `kernkompetenz`
--

CREATE TABLE `kernkompetenz` (
  `kernkompetenzID` int NOT NULL,
  `bezeichnung` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `kontaktaufnahme`
--

CREATE TABLE `kontaktaufnahme` (
  `kontaktaufnahmeID` int NOT NULL,
  `ansprechpartner_ansprechpartnerID` int NOT NULL,
  `insertTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `zeitpunkt` datetime NOT NULL,
  `kanal` enum('Telefon','E-Mail','Gespräch','Sonstiges') NOT NULL,
  `initiativeJBT` tinyint(1) NOT NULL,
  `mitglied_mitgliedID` int DEFAULT NULL,
  `grund` mediumtext,
  `kurzfassung` mediumtext,
  `neueDeadlines` mediumtext,
  `weitereNotizen` mediumtext
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `kurator`
--

CREATE TABLE `kurator` (
  `kuratorID` int NOT NULL,
  `kuratortyp` enum('wissenschaft','wirtschaft') NOT NULL DEFAULT 'wirtschaft',
  `name` varchar(100) NOT NULL,
  `bild` varchar(45) DEFAULT NULL,
  `kurzvorstellung` text,
  `kurator_seit` date DEFAULT NULL,
  `kontakt` text,
  `arbeit` text,
  `weitere_taetigkeiten` text,
  `auszeichnungen` text,
  `bisherigeKoop` text,
  `besonderes` text,
  `internes` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `kurator_akquiriert`
--

CREATE TABLE `kurator_akquiriert` (
  `kurator_kuratorID` int NOT NULL,
  `mitglied_mitgliedID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `messenger`
--

CREATE TABLE `messenger` (
  `messengerID` int NOT NULL,
  `bezeichnung` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `mitglied`
--

CREATE TABLE `mitglied` (
  `mitgliedID` int NOT NULL,
  `vorname` varchar(30) NOT NULL,
  `nachname` varchar(30) NOT NULL,
  `name` varchar(60) NOT NULL,
  `passwordHash` varchar(255) DEFAULT NULL,
  `passwort` varchar(45) DEFAULT NULL,
  `icalToken` varchar(16) DEFAULT NULL,
  `geschlecht` tinyint(1) DEFAULT NULL,
  `geburtsdatum` date DEFAULT NULL,
  `handy` varchar(20) DEFAULT NULL,
  `fax` varchar(20) DEFAULT NULL,
  `jbt_email` varchar(60) DEFAULT NULL,
  `mitgliedstatus` int NOT NULL,
  `generation` int DEFAULT NULL,
  `internesprojekt` int DEFAULT NULL,
  `internesprojekt_alt` varchar(150) DEFAULT NULL,
  `mentor` int DEFAULT NULL,
  `trainee_seit` date DEFAULT NULL,
  `mitglied_seit` date DEFAULT NULL,
  `alumnus_seit` date DEFAULT NULL,
  `senior_seit` date DEFAULT NULL,
  `aktiv_seit` date DEFAULT NULL,
  `passiv_seit` date DEFAULT NULL,
  `ausgetreten_seit` date DEFAULT NULL,
  `ressort` int NOT NULL,
  `arbeitgeber` varchar(30) DEFAULT NULL,
  `strasse1` varchar(30) DEFAULT NULL,
  `plz1` varchar(10) DEFAULT NULL,
  `ort1` varchar(30) DEFAULT NULL,
  `tel1` varchar(20) DEFAULT NULL,
  `email1` varchar(60) DEFAULT NULL,
  `strasse2` varchar(30) DEFAULT NULL,
  `plz2` varchar(10) DEFAULT NULL,
  `ort2` varchar(30) DEFAULT NULL,
  `tel2` varchar(20) DEFAULT NULL,
  `email2` varchar(60) NOT NULL,
  `hochschule` varchar(50) DEFAULT NULL,
  `studiengang` varchar(50) DEFAULT NULL,
  `studienbeginn` date DEFAULT NULL,
  `studienende` date DEFAULT NULL,
  `vertiefungen` varchar(1200) DEFAULT NULL,
  `ausbildung` varchar(60) DEFAULT NULL,
  `kontoinhaber` varchar(2048) DEFAULT NULL,
  `iban` varchar(2048) DEFAULT NULL,
  `bic` varchar(2048) DEFAULT NULL,
  `kontoinhaber_alt` blob,
  `kontonummer_alt` blob,
  `bankleitzahl_alt` blob,
  `kreditinstitut_alt` blob,
  `iban_alt` blob,
  `bic_alt` blob,
  `engagement` text,
  `bemerkungen` text,
  `austritt` text,
  `austrittsdatum` date DEFAULT NULL,
  `bild` varchar(60) DEFAULT NULL,
  `canPL` date DEFAULT NULL,
  `canQM` date DEFAULT NULL,
  `lastchange` date DEFAULT NULL,
  `sonstige_ws` text,
  `fuehrerschein` int NOT NULL DEFAULT '0',
  `fuehrerschein2` int NOT NULL DEFAULT '0',
  `fuehrerschein3` int NOT NULL DEFAULT '0',
  `ersthelferausbildung` tinyint(1) NOT NULL DEFAULT '0',
  `wahl_mentor` int DEFAULT NULL,
  `wahl_mentor1` int DEFAULT NULL,
  `wahl_mentor2` int DEFAULT NULL,
  `wahl_mentor3` int DEFAULT NULL,
  `wahl_internesprojekt` int DEFAULT NULL,
  `wahl_internesprojekt1` int DEFAULT NULL,
  `wahl_internesprojekt1_motivation` mediumtext,
  `wahl_internesprojekt2` int DEFAULT NULL,
  `wahl_internesprojekt2_motivation` mediumtext,
  `wahl_internesprojekt3` int DEFAULT NULL,
  `wahl_internesprojekt3_motivation` mediumtext,
  `wahl_ressort` int DEFAULT NULL,
  `wahl_ressort1` int DEFAULT NULL,
  `wahl_ressort2` int DEFAULT NULL,
  `wahl_ressort3` int DEFAULT NULL,
  `notizen` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='ALTER TABLE `mitglied` ADD `taetigkeiten` text';

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `mitgliedstatus`
--

CREATE TABLE `mitgliedstatus` (
  `mitgliedstatusID` int NOT NULL,
  `bezeichnung` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `mitglied_has_andererposten`
--

CREATE TABLE `mitglied_has_andererposten` (
  `mitglied_mitgliedID` int NOT NULL,
  `andererposten_andererpostenID` int NOT NULL,
  `von` date NOT NULL,
  `bis` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `mitglied_has_berechtigung`
--

CREATE TABLE `mitglied_has_berechtigung` (
  `mitglied_mitgliedID` int NOT NULL,
  `berechtigung_berechtigungID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `mitglied_has_bueroraumreservierung`
--

CREATE TABLE `mitglied_has_bueroraumreservierung` (
  `mitglied_has_bueroraumreservierungID` int NOT NULL,
  `bueroraum_bueroraumID` int NOT NULL,
  `mitglied_mitgliedID` int NOT NULL,
  `datum` date NOT NULL,
  `ende` date NOT NULL,
  `startzeit` varchar(10) DEFAULT NULL,
  `endzeit` varchar(10) DEFAULT NULL,
  `beschreibung` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `mitglied_has_event`
--

CREATE TABLE `mitglied_has_event` (
  `event_eventID` int NOT NULL,
  `mitglied_mitgliedID` int NOT NULL,
  `teilnehmer` tinyint(1) NOT NULL DEFAULT 1,
  `organisator` tinyint(1) NOT NULL DEFAULT 0,
  `anmeldezeitpunkt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `mitglied_has_eventww`
--

CREATE TABLE `mitglied_has_eventww` (
  `event_eventID` int NOT NULL,
  `mitglied_mitgliedID` int NOT NULL,
  `anreise` enum('FrF','FrM','FrA','SaF','SaM','SaA','SaS') DEFAULT NULL,
  `abreise` enum('FrM','FrA','SaF','SaM','SaA','So') DEFAULT NULL,
  `auto` tinyint(1) DEFAULT NULL,
  `plaetze` int DEFAULT NULL,
  `vegetarier` tinyint(1) DEFAULT NULL,
  `kommentar` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `mitglied_has_evposten`
--

CREATE TABLE `mitglied_has_evposten` (
  `mitglied_mitgliedID` int NOT NULL,
  `evposten_evpostenID` int NOT NULL,
  `von` date NOT NULL,
  `bis` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `mitglied_has_expertenwissen`
--

CREATE TABLE `mitglied_has_expertenwissen` (
  `mitglied_mitgliedID` int NOT NULL,
  `expertenwissen_expertenwissenID` int NOT NULL,
  `wert` varchar(150) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `mitglied_has_messenger`
--

CREATE TABLE `mitglied_has_messenger` (
  `mitglied_mitgliedID` int NOT NULL,
  `messenger_messengerID` int NOT NULL,
  `wert` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `mitglied_has_mitglied`
--

CREATE TABLE `mitglied_has_mitglied` (
  `mitgliedID_rater` int NOT NULL,
  `mitgliedID_target` int NOT NULL,
  `rating` tinyint(1) NOT NULL,
  `ratingID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `mitglied_has_projekt`
--

CREATE TABLE `mitglied_has_projekt` (
  `projekt_projektID` int NOT NULL,
  `mitglied_mitgliedID` int NOT NULL,
  `BTAufteilung` decimal(10,2) DEFAULT NULL,
  `SpesenAufteilung` decimal(10,2) DEFAULT NULL,
  `typ` enum('Bewerbung','Mitglied','PL','QM') DEFAULT NULL,
  `datum` date DEFAULT NULL,
  `bewerbungsdatum` datetime DEFAULT NULL,
  `vertragFreieMitarbeit` date DEFAULT NULL,
  `geldUeberwiesen` date DEFAULT NULL,
  `semester` int DEFAULT NULL,
  `praktika` text,
  `ausbildung` text,
  `werkstudententaetigkeit` text,
  `seminararbeiten` text,
  `workshops` text,
  `internesEngagement` set('Vorstandstätigkeit','Teamleiter') DEFAULT NULL,
  `vorleistungen` set('Herstellung des Erstkontakts','Schreiben des Angebots') DEFAULT NULL,
  `ausserordentlichesEngagement` text,
  `verfuegbarkeit` enum('Ohne Einschränkung','Mit Einschränkung') DEFAULT NULL,
  `einschraenkung` text,
  `motivation` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `mitglied_has_schulungsinstanz`
--

CREATE TABLE `mitglied_has_schulungsinstanz` (
  `schulungsinstanz_schulungsinstanzID` int NOT NULL,
  `mitglied_mitgliedID` int NOT NULL,
  `typ` enum('Anmeldung','Teilnehmer','Referent') NOT NULL,
  `datum` date DEFAULT NULL,
  `anwesend` tinyint(1) DEFAULT NULL,
  `feedbackAbgegeben` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `mitglied_has_status`
--

CREATE TABLE `mitglied_has_status` (
  `mitglied_mitgliedID` int NOT NULL,
  `datum` date NOT NULL COMMENT 'Genau genommen das Startdatum',
  `mitgliedstatus_status` int NOT NULL,
  `bemerkung` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `mmtracking`
--

CREATE TABLE `mmtracking` (
  `mmtrackingID` int NOT NULL,
  `datum` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `mmtracking_has_mitglied`
--

CREATE TABLE `mmtracking_has_mitglied` (
  `mmtracking_mmtrackingID` int NOT NULL,
  `mitglied_mitgliedID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `passwort_reset`
--

CREATE TABLE `passwort_reset` (
  `mitglied_jbt_email` varchar(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `datum` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `salt` binary(16) NOT NULL,
  `token` char(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `praktika`
--

CREATE TABLE `praktika` (
  `mitglied_mitgliedID` int NOT NULL,
  `unternehmen` varchar(100) DEFAULT NULL,
  `beschreibung` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='ALTER TABLE `mdb_new`.`praktika`  DROP PRIMARY KEY';

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `projekt`
--

CREATE TABLE `projekt` (
  `projektID` int NOT NULL,
  `status` enum('Bewerbung','Angebot','Durchführung','Abrechnung','Abgeschlossen','NichtBesetzt','PitchVerloren','AngebotAbgelehnt','Abgebrochen') DEFAULT NULL,
  `projektname` varchar(150) NOT NULL,
  `bewerbungenKey` char(32) NOT NULL,
  `auftraggeber` int DEFAULT NULL,
  `auftraggeberGeheim` tinyint(1) NOT NULL DEFAULT '0',
  `branche_old` int DEFAULT NULL,
  `unternehmen_old` varchar(100) DEFAULT NULL,
  `bemerkung` text,
  `kickoff` date DEFAULT NULL,
  `projektende` date DEFAULT NULL,
  `bewerbungbeginn1` datetime DEFAULT NULL,
  `bewerbungende1` datetime DEFAULT NULL,
  `bewerbungbeginn2` datetime DEFAULT NULL,
  `bewerbungende2` datetime DEFAULT NULL,
  `unterschriftsdatum` date DEFAULT NULL,
  `rechnungsstellung` date DEFAULT NULL,
  `rechnungsnr` int DEFAULT NULL,
  `abrechnung_seit` date DEFAULT NULL,
  `verkaufteBT` decimal(10,2) DEFAULT NULL,
  `geleisteteBT` decimal(10,2) DEFAULT NULL,
  `verkaufteSpesen` decimal(10,2) DEFAULT NULL,
  `euroProBT` decimal(10,2) DEFAULT NULL,
  `APbeiEV` tinyint(1) DEFAULT NULL,
  `evaluationBeiEV` tinyint(1) DEFAULT NULL,
  `DLbeiEV` tinyint(1) DEFAULT NULL,
  `geldEingegangen` tinyint(1) DEFAULT NULL,
  `zahlungsverzug` tinyint(1) DEFAULT NULL,
  `beratungsvertragVorhanden` tinyint(1) DEFAULT NULL,
  `teamvertragVorhanden` tinyint(1) DEFAULT NULL,
  `AngebotinAlfresco` tinyint(1) DEFAULT NULL,
  `AbweichungvomStandard` tinyint(1) DEFAULT NULL,
  `QMFreigabe` tinyint(1) DEFAULT NULL,
  `einsatzort` varchar(200) DEFAULT NULL,
  `ausschreibungdatum` datetime DEFAULT NULL,
  `ausschreibungstartschuss` varchar(45) DEFAULT NULL,
  `ausschreibungdauer` varchar(30) DEFAULT NULL,
  `ausschreibungBTmin` smallint DEFAULT NULL,
  `ausschreibungBTmax` smallint DEFAULT NULL,
  `ausschreibungEuroProBT` decimal(10,2) DEFAULT NULL,
  `ausschreibungEuroProBTrange` tinytext,
  `ausschreibungmitglmin` tinyint DEFAULT NULL,
  `ausschreibungmitglmax` tinyint DEFAULT NULL,
  `besetzungsgremium` text,
  `kundenart` enum('Altkunde','Neukunde') DEFAULT NULL,
  `kundensitz_old` varchar(45) DEFAULT NULL,
  `kundeAdresse1_old` varchar(200) DEFAULT NULL,
  `kundeAdresse2_old` varchar(200) DEFAULT NULL,
  `kundeAdresse3_old` varchar(200) DEFAULT NULL,
  `akquiseverantw` int DEFAULT NULL,
  `akquisemethode` enum('Kunde','Alumni','Kurator','Partner','PA','JBTler') DEFAULT NULL,
  `auftraggeberinfos_old` text,
  `situation` text,
  `besonderheiten` text,
  `kernkompetenz` int DEFAULT NULL,
  `anforderungsprofil` text,
  `referenzprojekte` varchar(240) DEFAULT NULL,
  `nettoverkaufspreisVariabel` decimal(10,2) DEFAULT NULL,
  `owncloud` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `projekt_has_akquisekanal`
--

CREATE TABLE `projekt_has_akquisekanal` (
  `projekt_projektID` int NOT NULL,
  `akquisekanal_akquisekanalID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `projekt_has_ansprechpartner`
--

CREATE TABLE `projekt_has_ansprechpartner` (
  `projekt_projektID` int NOT NULL,
  `ansprechpartner_ansprechpartnerID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `projekt_has_kernkompetenz`
--

CREATE TABLE `projekt_has_kernkompetenz` (
  `projekt_projektID` int NOT NULL,
  `kernkompetenz_kernkompetenzID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `ressort`
--

CREATE TABLE `ressort` (
  `ressortID` int NOT NULL,
  `bezeichnung` varchar(45) NOT NULL,
  `kuerzel` varchar(10) NOT NULL,
  `jbt_email` varchar(45) NOT NULL,
  `linkZielvorstellung` text,
  `linkOrganigramm` text,
  `kurzvorstellung` text NOT NULL,
  `inhalt` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `schulung`
--

CREATE TABLE `schulung` (
  `schulungID` int NOT NULL,
  `schulungsname` varchar(45) NOT NULL,
  `art` enum('Pflichtworkshop','Workshop','Externer Workshop') DEFAULT NULL,
  `beschreibung` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `schulungsfeedback`
--

CREATE TABLE `schulungsfeedback` (
  `schulungsfeedbackID` int NOT NULL,
  `schulungsinstanz_schulungsinstanzID` int NOT NULL,
  `datum` datetime DEFAULT NULL,
  `schulungsniveau` text,
  `inhaltlich` text,
  `praesentation` text,
  `schulungsbedarf` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `schulungsfeedback_has_feedbackfrage`
--

CREATE TABLE `schulungsfeedback_has_feedbackfrage` (
  `schulungsfeedback_schulungsfeedbackID` int NOT NULL,
  `feedbackfrage_feedbackfrageID` int NOT NULL,
  `note` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `schulungsfeedback_has_mitglied`
--

CREATE TABLE `schulungsfeedback_has_mitglied` (
  `schulungsfeedback_schulungsfeedbackID` int NOT NULL,
  `mitglied_mitgliedID` int NOT NULL,
  `note` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Stellvertreter-Struktur des Views `schulungsfeedback_note`
-- (Siehe unten für die tatsächliche Ansicht)
--
CREATE TABLE `schulungsfeedback_note` (
`schulungsfeedbackID` int
,`schulungsinstanz_schulungsinstanzID` int
,`datum` datetime
,`feedbacknote` decimal(14,4)
);

-- --------------------------------------------------------

--
-- Stellvertreter-Struktur des Views `schulungsfeedback_noten`
-- (Siehe unten für die tatsächliche Ansicht)
--
CREATE TABLE `schulungsfeedback_noten` (
`schulungsfeedback_schulungsfeedbackID` int
,`note` int
);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `schulungsinstanz`
--

CREATE TABLE `schulungsinstanz` (
  `schulungsinstanzID` int NOT NULL,
  `schulung_schulungID` int NOT NULL,
  `status` enum('Anmeldung','Anmeldung abgeschlossen','Feedback','Abgeschlossen') DEFAULT NULL,
  `datum` date DEFAULT NULL,
  `startzeit` varchar(10) DEFAULT NULL,
  `endzeit` varchar(10) DEFAULT NULL,
  `ort` varchar(45) DEFAULT NULL,
  `maximaleTeilnehmer` int DEFAULT NULL,
  `referenten` text,
  `zielgruppe` text,
  `anmeldungVon` datetime DEFAULT NULL,
  `anmeldungBis` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `session`
--

CREATE TABLE `session` (
  `mitglied_mitgliedID` int NOT NULL,
  `sessionkey` varchar(32) DEFAULT NULL,
  `gueltigBis` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `sprachen`
--

CREATE TABLE `sprachen` (
  `mitglied_mitgliedID` int NOT NULL,
  `wert` varchar(150) NOT NULL,
  `niveau` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `test_hcwbewerber`
--

CREATE TABLE `test_hcwbewerber` (
  `hcwbewerberID` int NOT NULL,
  `jahr` int NOT NULL,
  `eingangsdatum` datetime NOT NULL,
  `token` varchar(32) NOT NULL,
  `nachname` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `vorname` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `anrede` int NOT NULL,
  `titel` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `geburtsdatum` date NOT NULL,
  `handy` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `festnetz` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `email` varchar(65) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `strasse` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `hausnr` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `plz` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ort` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `schule_Abiturnote` decimal(10,2) DEFAULT NULL,
  `schule_Abiturtermin` varchar(45) DEFAULT NULL,
  `schule_Schule` varchar(200) DEFAULT NULL,
  `schule_Ort` varchar(160) DEFAULT NULL,
  `studium_Hochschule` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `studium_Abschluss` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `studium_Beginn` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `studium_Ende` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `studium_Fach` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `studium_Fachsemester` int DEFAULT NULL,
  `studium_StatusAbschlussarbeit` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `studium_Notenschnitt` decimal(10,2) DEFAULT NULL,
  `studium_Auslandssemester` tinyint(1) DEFAULT NULL,
  `studium_Berufsausbildung` tinyint(1) DEFAULT NULL,
  `praxis_Berufstaetigkeit` int DEFAULT NULL,
  `praxis_Praktika` int DEFAULT NULL,
  `praxis_Auslandspraktika` int DEFAULT NULL,
  `praxis_Hiwi` int DEFAULT NULL,
  `praxis_Werkstudent` int DEFAULT NULL,
  `edv_Word` int DEFAULT NULL,
  `edv_Excel` int DEFAULT NULL,
  `edv_PowerPoint` int DEFAULT NULL,
  `edv_Access` int DEFAULT NULL,
  `flyer` tinyint(1) DEFAULT NULL,
  `plakate` tinyint(1) DEFAULT NULL,
  `vorlesungen` tinyint(1) DEFAULT NULL,
  `netzwerke` tinyint(1) DEFAULT NULL,
  `karriereportale` tinyint(1) DEFAULT NULL,
  `freunde` tinyint(1) DEFAULT NULL,
  `professoren` tinyint(1) DEFAULT NULL,
  `stiftungen` tinyint(1) DEFAULT NULL,
  `newsletter` tinyint(1) DEFAULT NULL,
  `vergangener_Bachelor_Hochschule` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `vergangener_Bachelor_Beginn` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `vergangener_Bachelor_Ende` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `vergangener_Bachelor_Fach` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `vergangener_Bachelor_Notenschnitt` decimal(10,2) DEFAULT NULL,
  `praxis_Beratererfahrung` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `test_hcwbewerber_anlage`
--

CREATE TABLE `test_hcwbewerber_anlage` (
  `hcwbewerber_hcwbewerberID` int NOT NULL,
  `anlageIndex` int NOT NULL,
  `filename` varchar(200) NOT NULL,
  `filesize` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `test_hcwbewerber_has_beratung`
--

CREATE TABLE `test_hcwbewerber_has_beratung` (
  `hcwbewerber_hcwbewerberID` int NOT NULL,
  `hcwberatung_hcwberatungID` int NOT NULL,
  `einstufung` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `trace`
--

CREATE TABLE `trace` (
  `traceID` int NOT NULL,
  `aenderungszeitpunkt` datetime NOT NULL,
  `aktion` varchar(150) NOT NULL,
  `benutzer` varchar(45) NOT NULL,
  `tabelle` text NOT NULL,
  `geaenderteID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `traineebewerber`
--

CREATE TABLE `traineebewerber` (
  `traineebewerberID` int NOT NULL,
  `generation` int NOT NULL,
  `eingangsdatum` datetime NOT NULL,
  `eingeladen` tinyint(1) NOT NULL DEFAULT '0',
  `aufnehmen` tinyint(1) NOT NULL DEFAULT '0',
  `aufgenommen` int DEFAULT NULL,
  `vorname` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `nachname` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `geschlecht` tinyint(1) DEFAULT NULL,
  `bild` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `geburtsdatum` date DEFAULT NULL,
  `handy` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `festnetz` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `email` varchar(65) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `heimatAdr_Strasse` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `heimatAdr_Nr` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `heimatAdr_PLZ` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `heimatAdr_Ort` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `studienAdr_Strasse` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `studienAdr_Nr` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `studienAdr_PLZ` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `studienAdr_Ort` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `studium_Abschluss` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `studium_Hochschule` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `studium_Fach` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `studium_SonstigesFach` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `studium_Beginn` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `studium_Fachsemester` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `studium_1Vertiefung` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `studium_2Vertiefung` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `studium_3Vertiefung` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `studium_BachelorFach` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `studium_BachelorHochschule` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `berufsausbildung_Beruf` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `berufsausbildung_Unternehmen` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `berufsausbildung_Ort` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `berufsausbildung_Beginn` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `berufsausbildung_Ende` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `beruf_Taetigkeit` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `beruf_Unternehmen` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `beruf_Ort` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `beruf_Beginn` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `beruf_Ende` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `edv` mediumtext CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `hobbies` mediumtext CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `zeit` mediumtext CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `motivation` mediumtext CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `radiovalue1` int DEFAULT NULL,
  `radiovalue2` int DEFAULT NULL,
  `radiovalue3` int DEFAULT NULL,
  `radiovalue4` int DEFAULT NULL,
  `radiovalue5` int DEFAULT NULL,
  `radiovalue6` int DEFAULT NULL,
  `radiovalue7` int DEFAULT NULL,
  `radiovalue8` int DEFAULT NULL,
  `flyer` tinyint(1) DEFAULT NULL,
  `plakate` tinyint(1) DEFAULT NULL,
  `vorlesungen` tinyint(1) DEFAULT NULL,
  `freunde` tinyint(1) DEFAULT NULL,
  `internet` tinyint(1) DEFAULT NULL,
  `sonstiges` tinyint(1) DEFAULT NULL,
  `sonstigesText` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `workingWeekend` tinyint(1) DEFAULT NULL,
  `verfuegbarkeitAuswahlWE` enum('kannImmer','nichtFR','nichtSA','nichtSO') DEFAULT NULL,
  `socialmedia` tinyint DEFAULT NULL,
  `campusrallye` tinyint DEFAULT NULL,
  `partner` tinyint DEFAULT NULL,
  `newsletter` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `traineebewerber_bewertung`
--

CREATE TABLE `traineebewerber_bewertung` (
  `traineebewerber_traineebewerberID` int NOT NULL,
  `mitglied_mitgliedID` int NOT NULL,
  `bewertung` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `traineebewerber_ehrenamtlichschule`
--

CREATE TABLE `traineebewerber_ehrenamtlichschule` (
  `id` int NOT NULL,
  `traineebewerberID` int NOT NULL,
  `taetigkeit` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `traineebewerber_ehrenamtlichstudium`
--

CREATE TABLE `traineebewerber_ehrenamtlichstudium` (
  `id` int NOT NULL,
  `traineebewerberID` int NOT NULL,
  `taetigkeit` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `traineebewerber_hiwi`
--

CREATE TABLE `traineebewerber_hiwi` (
  `id` int NOT NULL,
  `traineebewerberID` int NOT NULL,
  `taetigkeit` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `unternehmen` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ort` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `beginn` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ende` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `traineebewerber_praktikum`
--

CREATE TABLE `traineebewerber_praktikum` (
  `id` int NOT NULL,
  `traineebewerberID` int NOT NULL,
  `taetigkeit` text,
  `unternehmen` varchar(200) DEFAULT NULL,
  `ort` varchar(100) DEFAULT NULL,
  `beginn` varchar(45) DEFAULT NULL,
  `ende` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `traineebewerber_sprache`
--

CREATE TABLE `traineebewerber_sprache` (
  `id` int NOT NULL,
  `traineebewerberID` int NOT NULL,
  `sprache` varchar(45) DEFAULT NULL,
  `sprachlevel` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `unternehmen`
--

CREATE TABLE `unternehmen` (
  `unternehmenID` int NOT NULL,
  `interessent` tinyint(1) NOT NULL DEFAULT '0',
  `name` varchar(300) NOT NULL,
  `branche` int DEFAULT NULL,
  `kurzbeschreibung` mediumtext,
  `adresszusatz` varchar(500) DEFAULT NULL,
  `strasse` varchar(100) DEFAULT NULL,
  `plz` varchar(10) DEFAULT NULL,
  `ort` varchar(100) DEFAULT NULL,
  `url` varchar(100) DEFAULT NULL,
  `wichtigeInfos` mediumtext,
  `umsatzstaerke` int DEFAULT NULL,
  `projektzahl` int DEFAULT NULL,
  `btzahl` int DEFAULT NULL,
  `zufriedenheit` int DEFAULT NULL,
  `kontaktErwuenscht` tinyint(1) NOT NULL DEFAULT '0',
  `kontaktkanal` varchar(45) DEFAULT NULL,
  `geheim` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struktur des Views `schulungsfeedback_note`
--
DROP TABLE IF EXISTS `schulungsfeedback_note`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `schulungsfeedback_note`  AS SELECT `schulungsfeedback`.`schulungsfeedbackID` AS `schulungsfeedbackID`, `schulungsfeedback`.`schulungsinstanz_schulungsinstanzID` AS `schulungsinstanz_schulungsinstanzID`, `schulungsfeedback`.`datum` AS `datum`, (select avg(`schulungsfeedback_noten`.`note`) from `schulungsfeedback_noten` where (`schulungsfeedback_noten`.`schulungsfeedback_schulungsfeedbackID` = `schulungsfeedback`.`schulungsfeedbackID`)) AS `feedbacknote` FROM `schulungsfeedback` ;

-- --------------------------------------------------------

--
-- Struktur des Views `schulungsfeedback_noten`
--
DROP TABLE IF EXISTS `schulungsfeedback_noten`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `schulungsfeedback_noten`  AS SELECT `schulungsfeedback_has_feedbackfrage`.`schulungsfeedback_schulungsfeedbackID` AS `schulungsfeedback_schulungsfeedbackID`, `schulungsfeedback_has_feedbackfrage`.`note` AS `note` FROM `schulungsfeedback_has_feedbackfrage`union all select `schulungsfeedback_has_mitglied`.`schulungsfeedback_schulungsfeedbackID` AS `schulungsfeedback_schulungsfeedbackID`,`schulungsfeedback_has_mitglied`.`note` AS `note` from `schulungsfeedback_has_mitglied`  ;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `akquisekanal`
--
ALTER TABLE `akquisekanal`
  ADD PRIMARY KEY (`akquisekanalID`),
  ADD UNIQUE KEY `idakquisekanal_UNIQUE` (`akquisekanalID`);

--
-- Indizes für die Tabelle `andererposten`
--
ALTER TABLE `andererposten`
  ADD PRIMARY KEY (`andererpostenID`);

--
-- Indizes für die Tabelle `ansprechpartner`
--
ALTER TABLE `ansprechpartner`
  ADD PRIMARY KEY (`ansprechpartnerID`),
  ADD KEY `ansprechpartner_unternehmen_idx` (`unternehmen_unternehmenID`),
  ADD KEY `ansprechpartner_kontaktperson_idx` (`kontaktperson`);

--
-- Indizes für die Tabelle `berechtigung`
--
ALTER TABLE `berechtigung`
  ADD PRIMARY KEY (`berechtigungID`),
  ADD UNIQUE KEY `berechtigungID_UNIQUE` (`berechtigungID`),
  ADD UNIQUE KEY `bezeichnung_UNIQUE` (`bezeichnung`);

--
-- Indizes für die Tabelle `branche`
--
ALTER TABLE `branche`
  ADD PRIMARY KEY (`brancheID`),
  ADD UNIQUE KEY `bezeichnung_UNIQUE` (`bezeichnung`);

--
-- Indizes für die Tabelle `bueroraum`
--
ALTER TABLE `bueroraum`
  ADD PRIMARY KEY (`bueroraumID`);

--
-- Indizes für die Tabelle `edvkenntnisse`
--
ALTER TABLE `edvkenntnisse`
  ADD PRIMARY KEY (`mitglied_mitgliedID`,`wert`);

--
-- Indizes für die Tabelle `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`eventID`),
  ADD UNIQUE KEY `eventID_UNIQUE` (`eventID`);

--
-- Indizes für die Tabelle `evposten`
--
ALTER TABLE `evposten`
  ADD PRIMARY KEY (`evpostenID`),
  ADD UNIQUE KEY `mitgliedstatusID_UNIQUE` (`evpostenID`),
  ADD UNIQUE KEY `ressortID_UNIQUE` (`ressortID`),
  ADD KEY `fk_evposten_ressort` (`ressortID`);

--
-- Indizes für die Tabelle `evposten_has_berechtigung`
--
ALTER TABLE `evposten_has_berechtigung`
  ADD PRIMARY KEY (`evposten_evpostenID`,`berechtigung_berechtigungID`),
  ADD KEY `fk_evposten_has_berechtigung_berechtigung_idx` (`berechtigung_berechtigungID`);

--
-- Indizes für die Tabelle `expertenwissen`
--
ALTER TABLE `expertenwissen`
  ADD PRIMARY KEY (`expertenwissenID`);

--
-- Indizes für die Tabelle `feedbackfrage`
--
ALTER TABLE `feedbackfrage`
  ADD PRIMARY KEY (`feedbackfrageID`);

--
-- Indizes für die Tabelle `generation`
--
ALTER TABLE `generation`
  ADD PRIMARY KEY (`generationID`),
  ADD UNIQUE KEY `generationID_UNIQUE` (`generationID`),
  ADD UNIQUE KEY `bezeichnung_UNIQUE` (`bezeichnung`);

--
-- Indizes für die Tabelle `generationenbeauftragter`
--
ALTER TABLE `generationenbeauftragter`
  ADD PRIMARY KEY (`generation_generationID`,`mitglied_mitgliedID`);

--
-- Indizes für die Tabelle `generation_has_mentor`
--
ALTER TABLE `generation_has_mentor`
  ADD PRIMARY KEY (`mitglied_mitgliedID`,`generation_generationID`),
  ADD KEY `fk_Mitglied` (`mitglied_mitgliedID`),
  ADD KEY `fk_Generation` (`generation_generationID`);

--
-- Indizes für die Tabelle `hcw`
--
ALTER TABLE `hcw`
  ADD PRIMARY KEY (`hcwJahr`),
  ADD UNIQUE KEY `jahr_UNIQUE` (`hcwJahr`);

--
-- Indizes für die Tabelle `hcwberatung`
--
ALTER TABLE `hcwberatung`
  ADD PRIMARY KEY (`hcwberatungID`),
  ADD UNIQUE KEY `session_UNIQUE` (`session`),
  ADD KEY `fk_hcwberatung_hcw_idx` (`jahr`);

--
-- Indizes für die Tabelle `hcwbewerber`
--
ALTER TABLE `hcwbewerber`
  ADD PRIMARY KEY (`hcwbewerberID`),
  ADD KEY `fk_hcwbewerber_hcw_idx` (`jahr`);

--
-- Indizes für die Tabelle `hcwbewerber_anlage`
--
ALTER TABLE `hcwbewerber_anlage`
  ADD PRIMARY KEY (`hcwbewerber_hcwbewerberID`,`anlageIndex`);

--
-- Indizes für die Tabelle `hcwbewerber_has_beratung`
--
ALTER TABLE `hcwbewerber_has_beratung`
  ADD PRIMARY KEY (`hcwbewerber_hcwbewerberID`,`hcwberatung_hcwberatungID`),
  ADD KEY `fk_hcwbewerber_has_beratung_hcwberatung_idx` (`hcwberatung_hcwberatungID`);

--
-- Indizes für die Tabelle `hilfetext`
--
ALTER TABLE `hilfetext`
  ADD PRIMARY KEY (`hilfetextID`);

--
-- Indizes für die Tabelle `innovation`
--
ALTER TABLE `innovation`
  ADD PRIMARY KEY (`innovationID`),
  ADD UNIQUE KEY `innovationID_UNIQUE` (`innovationID`),
  ADD KEY `autor` (`autor`),
  ADD KEY `fk_ressort_idx` (`ressortBeiEinreichung`);

--
-- Indizes für die Tabelle `internesprojekt`
--
ALTER TABLE `internesprojekt`
  ADD PRIMARY KEY (`internesprojektID`),
  ADD KEY `fk_IP_Generation` (`generation`);

--
-- Indizes für die Tabelle `internesprojekt_has_qm`
--
ALTER TABLE `internesprojekt_has_qm`
  ADD PRIMARY KEY (`internesprojekt_internesprojektID`,`mitglied_mitgliedID`),
  ADD KEY `fk_internesprojekt_qm_mitglied_idx` (`mitglied_mitgliedID`);

--
-- Indizes für die Tabelle `kernkompetenz`
--
ALTER TABLE `kernkompetenz`
  ADD PRIMARY KEY (`kernkompetenzID`),
  ADD UNIQUE KEY `mitgliedstatusID_UNIQUE` (`kernkompetenzID`);

--
-- Indizes für die Tabelle `kontaktaufnahme`
--
ALTER TABLE `kontaktaufnahme`
  ADD PRIMARY KEY (`kontaktaufnahmeID`),
  ADD KEY `kontaktaufnahme_ansprechpartner_fk_idx` (`ansprechpartner_ansprechpartnerID`),
  ADD KEY `kontaktaufnahme_mitglied_fk_idx` (`mitglied_mitgliedID`);

--
-- Indizes für die Tabelle `kurator`
--
ALTER TABLE `kurator`
  ADD PRIMARY KEY (`kuratorID`),
  ADD UNIQUE KEY `kuratorID_UNIQUE` (`kuratorID`),
  ADD UNIQUE KEY `name_UNIQUE` (`name`);

--
-- Indizes für die Tabelle `kurator_akquiriert`
--
ALTER TABLE `kurator_akquiriert`
  ADD PRIMARY KEY (`kurator_kuratorID`,`mitglied_mitgliedID`),
  ADD KEY `fk_kurator_akquiriert_mitglied_idx` (`mitglied_mitgliedID`);

--
-- Indizes für die Tabelle `messenger`
--
ALTER TABLE `messenger`
  ADD PRIMARY KEY (`messengerID`);

--
-- Indizes für die Tabelle `mitglied`
--
ALTER TABLE `mitglied`
  ADD PRIMARY KEY (`mitgliedID`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `mitgliedID_UNIQUE` (`mitgliedID`),
  ADD UNIQUE KEY `fk_Mitglied_jbt_email` (`jbt_email`) USING BTREE,
  ADD KEY `fk_Mitglied_Mitglied1` (`mentor`),
  ADD KEY `fk_Mitglied_Mitgliedstatus1` (`mitgliedstatus`),
  ADD KEY `fk_Mitglied_Ressort1` (`ressort`),
  ADD KEY `fk_Mitglied_Generation` (`generation`);

--
-- Indizes für die Tabelle `mitgliedstatus`
--
ALTER TABLE `mitgliedstatus`
  ADD PRIMARY KEY (`mitgliedstatusID`),
  ADD UNIQUE KEY `mitgliedstatusID_UNIQUE` (`mitgliedstatusID`);

--
-- Indizes für die Tabelle `mitglied_has_andererposten`
--
ALTER TABLE `mitglied_has_andererposten`
  ADD PRIMARY KEY (`mitglied_mitgliedID`,`andererposten_andererpostenID`,`von`),
  ADD KEY `fk_mitglied_has_andererposten_andererposten` (`andererposten_andererpostenID`);

--
-- Indizes für die Tabelle `mitglied_has_berechtigung`
--
ALTER TABLE `mitglied_has_berechtigung`
  ADD PRIMARY KEY (`mitglied_mitgliedID`,`berechtigung_berechtigungID`),
  ADD KEY `fk_Mitglied_has_Berechtigung_Berechtigung1` (`berechtigung_berechtigungID`),
  ADD KEY `mitglied_mitgliedID` (`mitglied_mitgliedID`),
  ADD KEY `berechtigung_berechtigungID` (`berechtigung_berechtigungID`);

--
-- Indizes für die Tabelle `mitglied_has_bueroraumreservierung`
--
ALTER TABLE `mitglied_has_bueroraumreservierung`
  ADD PRIMARY KEY (`mitglied_has_bueroraumreservierungID`),
  ADD KEY `fk_mitglied_has_bueroraumreservierung_bueroraum1_idx` (`bueroraum_bueroraumID`),
  ADD KEY `fk_mitglied_has_bueroraumreservierung_mitglied1_idx` (`mitglied_mitgliedID`);

--
-- Indizes für die Tabelle `mitglied_has_event`
--
ALTER TABLE `mitglied_has_event`
  ADD PRIMARY KEY (`event_eventID`,`mitglied_mitgliedID`),
  ADD KEY `fk_mitglied_has_event_event1` (`event_eventID`),
  ADD KEY `fk_mitglied_has_event_mitglied1` (`mitglied_mitgliedID`);

--
-- Indizes für die Tabelle `mitglied_has_eventww`
--
ALTER TABLE `mitglied_has_eventww`
  ADD PRIMARY KEY (`event_eventID`,`mitglied_mitgliedID`),
  ADD KEY `fk_mitglied_has_eventww_mitglied1` (`mitglied_mitgliedID`),
  ADD KEY `fk_mitglied_has_eventww_event1` (`event_eventID`);

--
-- Indizes für die Tabelle `mitglied_has_evposten`
--
ALTER TABLE `mitglied_has_evposten`
  ADD PRIMARY KEY (`mitglied_mitgliedID`,`evposten_evpostenID`),
  ADD KEY `fk_Mitglied_has_EVposten_EVposten1` (`evposten_evpostenID`);

--
-- Indizes für die Tabelle `mitglied_has_expertenwissen`
--
ALTER TABLE `mitglied_has_expertenwissen`
  ADD PRIMARY KEY (`mitglied_mitgliedID`,`expertenwissen_expertenwissenID`,`wert`),
  ADD KEY `fk_mitglied_has_expertenwissen_expertenwissen1` (`expertenwissen_expertenwissenID`);

--
-- Indizes für die Tabelle `mitglied_has_messenger`
--
ALTER TABLE `mitglied_has_messenger`
  ADD PRIMARY KEY (`mitglied_mitgliedID`,`messenger_messengerID`),
  ADD KEY `fk_mitglied_has_messenger_messenger1` (`messenger_messengerID`);

--
-- Indizes für die Tabelle `mitglied_has_mitglied`
--
ALTER TABLE `mitglied_has_mitglied`
  ADD PRIMARY KEY (`ratingID`);

--
-- Indizes für die Tabelle `mitglied_has_projekt`
--
ALTER TABLE `mitglied_has_projekt`
  ADD PRIMARY KEY (`projekt_projektID`,`mitglied_mitgliedID`),
  ADD KEY `fk_projects_has_members_members1` (`mitglied_mitgliedID`);

--
-- Indizes für die Tabelle `mitglied_has_schulungsinstanz`
--
ALTER TABLE `mitglied_has_schulungsinstanz`
  ADD PRIMARY KEY (`schulungsinstanz_schulungsinstanzID`,`mitglied_mitgliedID`),
  ADD KEY `fk_Schulunginstanz_has_Mitglied_Mitglied1` (`mitglied_mitgliedID`);

--
-- Indizes für die Tabelle `mitglied_has_status`
--
ALTER TABLE `mitglied_has_status`
  ADD PRIMARY KEY (`mitglied_mitgliedID`,`datum`),
  ADD KEY `fk_status_idx` (`mitgliedstatus_status`);

--
-- Indizes für die Tabelle `mmtracking`
--
ALTER TABLE `mmtracking`
  ADD PRIMARY KEY (`mmtrackingID`),
  ADD UNIQUE KEY `datum_UNIQUE` (`datum`),
  ADD UNIQUE KEY `mmtrackingID_UNIQUE` (`mmtrackingID`);

--
-- Indizes für die Tabelle `mmtracking_has_mitglied`
--
ALTER TABLE `mmtracking_has_mitglied`
  ADD PRIMARY KEY (`mmtracking_mmtrackingID`,`mitglied_mitgliedID`),
  ADD KEY `fk_mmtracking_has_mitglied_mitglied1` (`mitglied_mitgliedID`);

--
-- Indizes für die Tabelle `passwort_reset`
--
ALTER TABLE `passwort_reset`
  ADD PRIMARY KEY (`mitglied_jbt_email`);

--
-- Indizes für die Tabelle `praktika`
--
ALTER TABLE `praktika`
  ADD PRIMARY KEY (`mitglied_mitgliedID`,`beschreibung`);

--
-- Indizes für die Tabelle `projekt`
--
ALTER TABLE `projekt`
  ADD PRIMARY KEY (`projektID`),
  ADD UNIQUE KEY `projekt_id_UNIQUE` (`projektID`),
  ADD KEY `fk_branche` (`branche_old`),
  ADD KEY `fk_auftraggeber_idx` (`auftraggeber`),
  ADD KEY `fk_akquiseverantw_idx` (`akquiseverantw`);

--
-- Indizes für die Tabelle `projekt_has_akquisekanal`
--
ALTER TABLE `projekt_has_akquisekanal`
  ADD PRIMARY KEY (`projekt_projektID`,`akquisekanal_akquisekanalID`);

--
-- Indizes für die Tabelle `projekt_has_ansprechpartner`
--
ALTER TABLE `projekt_has_ansprechpartner`
  ADD PRIMARY KEY (`projekt_projektID`,`ansprechpartner_ansprechpartnerID`),
  ADD KEY `projekt_has_ansprechpartner_ansprechpartner_fk_idx` (`ansprechpartner_ansprechpartnerID`);

--
-- Indizes für die Tabelle `projekt_has_kernkompetenz`
--
ALTER TABLE `projekt_has_kernkompetenz`
  ADD PRIMARY KEY (`projekt_projektID`,`kernkompetenz_kernkompetenzID`),
  ADD KEY `fk_projekt_has_kernkompetenz_kernkompetenz1` (`kernkompetenz_kernkompetenzID`),
  ADD KEY `fk_projekt_has_kernkompetenz_projekt1` (`projekt_projektID`);

--
-- Indizes für die Tabelle `ressort`
--
ALTER TABLE `ressort`
  ADD PRIMARY KEY (`ressortID`),
  ADD UNIQUE KEY `Bezeichnung_UNIQUE` (`bezeichnung`),
  ADD UNIQUE KEY `ressortID_UNIQUE` (`ressortID`),
  ADD UNIQUE KEY `kuerzel_UNIQUE` (`kuerzel`);

--
-- Indizes für die Tabelle `schulung`
--
ALTER TABLE `schulung`
  ADD PRIMARY KEY (`schulungID`),
  ADD UNIQUE KEY `schulungID_UNIQUE` (`schulungID`);

--
-- Indizes für die Tabelle `schulungsfeedback`
--
ALTER TABLE `schulungsfeedback`
  ADD PRIMARY KEY (`schulungsfeedbackID`),
  ADD UNIQUE KEY `schulungsinstanzID_UNIQUE` (`schulungsfeedbackID`),
  ADD KEY `fk_schulungsfeedback_schulungsinstanz1` (`schulungsinstanz_schulungsinstanzID`);

--
-- Indizes für die Tabelle `schulungsfeedback_has_feedbackfrage`
--
ALTER TABLE `schulungsfeedback_has_feedbackfrage`
  ADD PRIMARY KEY (`schulungsfeedback_schulungsfeedbackID`,`feedbackfrage_feedbackfrageID`),
  ADD KEY `fk_schulungsfeedback_has_feedbackfrage_feedbackfrage1` (`feedbackfrage_feedbackfrageID`),
  ADD KEY `fk_schulungsfeedback_has_feedbackfrage_schulungsfeedback1` (`schulungsfeedback_schulungsfeedbackID`);

--
-- Indizes für die Tabelle `schulungsfeedback_has_mitglied`
--
ALTER TABLE `schulungsfeedback_has_mitglied`
  ADD PRIMARY KEY (`schulungsfeedback_schulungsfeedbackID`,`mitglied_mitgliedID`),
  ADD KEY `fk_schulungsfeedback_has_mitglied_mitglied1` (`mitglied_mitgliedID`),
  ADD KEY `fk_schulungsfeedback_has_mitglied_schulungsfeedback1` (`schulungsfeedback_schulungsfeedbackID`);

--
-- Indizes für die Tabelle `schulungsinstanz`
--
ALTER TABLE `schulungsinstanz`
  ADD PRIMARY KEY (`schulungsinstanzID`),
  ADD UNIQUE KEY `schulungsinstanzID_UNIQUE` (`schulungsinstanzID`),
  ADD KEY `fk_Schulunginstanz_Schulungen1` (`schulung_schulungID`);

--
-- Indizes für die Tabelle `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`mitglied_mitgliedID`),
  ADD KEY `fk_Session_mitglied1` (`mitglied_mitgliedID`);

--
-- Indizes für die Tabelle `sprachen`
--
ALTER TABLE `sprachen`
  ADD PRIMARY KEY (`mitglied_mitgliedID`,`wert`),
  ADD KEY `fk_Sprachen_mitglied1` (`mitglied_mitgliedID`);

--
-- Indizes für die Tabelle `test_hcwbewerber`
--
ALTER TABLE `test_hcwbewerber`
  ADD PRIMARY KEY (`hcwbewerberID`),
  ADD KEY `fk_hcwbewerber_hcw_idx` (`jahr`);

--
-- Indizes für die Tabelle `test_hcwbewerber_anlage`
--
ALTER TABLE `test_hcwbewerber_anlage`
  ADD PRIMARY KEY (`hcwbewerber_hcwbewerberID`,`anlageIndex`);

--
-- Indizes für die Tabelle `test_hcwbewerber_has_beratung`
--
ALTER TABLE `test_hcwbewerber_has_beratung`
  ADD PRIMARY KEY (`hcwbewerber_hcwbewerberID`,`hcwberatung_hcwberatungID`),
  ADD KEY `fk_hcwbewerber_has_beratung_hcwberatung_idx` (`hcwberatung_hcwberatungID`);

--
-- Indizes für die Tabelle `trace`
--
ALTER TABLE `trace`
  ADD PRIMARY KEY (`traceID`),
  ADD UNIQUE KEY `traceID_UNIQUE` (`traceID`);

--
-- Indizes für die Tabelle `traineebewerber`
--
ALTER TABLE `traineebewerber`
  ADD PRIMARY KEY (`traineebewerberID`),
  ADD KEY `fk_traineebewerber_generation` (`generation`),
  ADD KEY `fk_aufgenommen_mitglied` (`aufgenommen`);

--
-- Indizes für die Tabelle `traineebewerber_bewertung`
--
ALTER TABLE `traineebewerber_bewertung`
  ADD PRIMARY KEY (`traineebewerber_traineebewerberID`,`mitglied_mitgliedID`);

--
-- Indizes für die Tabelle `traineebewerber_ehrenamtlichschule`
--
ALTER TABLE `traineebewerber_ehrenamtlichschule`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_traineebewerber_ehrenamtlichschule` (`traineebewerberID`);

--
-- Indizes für die Tabelle `traineebewerber_ehrenamtlichstudium`
--
ALTER TABLE `traineebewerber_ehrenamtlichstudium`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_traineebewerber_ehrenamtlichstudium` (`traineebewerberID`);

--
-- Indizes für die Tabelle `traineebewerber_hiwi`
--
ALTER TABLE `traineebewerber_hiwi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_traineebewerber` (`traineebewerberID`);

--
-- Indizes für die Tabelle `traineebewerber_praktikum`
--
ALTER TABLE `traineebewerber_praktikum`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_traineebewerber` (`traineebewerberID`);

--
-- Indizes für die Tabelle `traineebewerber_sprache`
--
ALTER TABLE `traineebewerber_sprache`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_traineebewerber_sprache` (`traineebewerberID`);

--
-- Indizes für die Tabelle `unternehmen`
--
ALTER TABLE `unternehmen`
  ADD PRIMARY KEY (`unternehmenID`),
  ADD UNIQUE KEY `name_UNIQUE` (`name`),
  ADD KEY `unternehmen_branche_fk_idx` (`branche`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `akquisekanal`
--
ALTER TABLE `akquisekanal`
  MODIFY `akquisekanalID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `andererposten`
--
ALTER TABLE `andererposten`
  MODIFY `andererpostenID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `ansprechpartner`
--
ALTER TABLE `ansprechpartner`
  MODIFY `ansprechpartnerID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `berechtigung`
--
ALTER TABLE `berechtigung`
  MODIFY `berechtigungID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `branche`
--
ALTER TABLE `branche`
  MODIFY `brancheID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `bueroraum`
--
ALTER TABLE `bueroraum`
  MODIFY `bueroraumID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `event`
--
ALTER TABLE `event`
  MODIFY `eventID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `evposten`
--
ALTER TABLE `evposten`
  MODIFY `evpostenID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `expertenwissen`
--
ALTER TABLE `expertenwissen`
  MODIFY `expertenwissenID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `generation`
--
ALTER TABLE `generation`
  MODIFY `generationID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `hcwberatung`
--
ALTER TABLE `hcwberatung`
  MODIFY `hcwberatungID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `hcwbewerber`
--
ALTER TABLE `hcwbewerber`
  MODIFY `hcwbewerberID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `innovation`
--
ALTER TABLE `innovation`
  MODIFY `innovationID` int NOT NULL AUTO_INCREMENT COMMENT 'PK';

--
-- AUTO_INCREMENT für Tabelle `internesprojekt`
--
ALTER TABLE `internesprojekt`
  MODIFY `internesprojektID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `kernkompetenz`
--
ALTER TABLE `kernkompetenz`
  MODIFY `kernkompetenzID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `kontaktaufnahme`
--
ALTER TABLE `kontaktaufnahme`
  MODIFY `kontaktaufnahmeID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `kurator`
--
ALTER TABLE `kurator`
  MODIFY `kuratorID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `messenger`
--
ALTER TABLE `messenger`
  MODIFY `messengerID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `mitglied`
--
ALTER TABLE `mitglied`
  MODIFY `mitgliedID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `mitgliedstatus`
--
ALTER TABLE `mitgliedstatus`
  MODIFY `mitgliedstatusID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `mitglied_has_bueroraumreservierung`
--
ALTER TABLE `mitglied_has_bueroraumreservierung`
  MODIFY `mitglied_has_bueroraumreservierungID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `mmtracking`
--
ALTER TABLE `mmtracking`
  MODIFY `mmtrackingID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `projekt`
--
ALTER TABLE `projekt`
  MODIFY `projektID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `ressort`
--
ALTER TABLE `ressort`
  MODIFY `ressortID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `schulung`
--
ALTER TABLE `schulung`
  MODIFY `schulungID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `schulungsfeedback`
--
ALTER TABLE `schulungsfeedback`
  MODIFY `schulungsfeedbackID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `schulungsinstanz`
--
ALTER TABLE `schulungsinstanz`
  MODIFY `schulungsinstanzID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `test_hcwbewerber`
--
ALTER TABLE `test_hcwbewerber`
  MODIFY `hcwbewerberID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `trace`
--
ALTER TABLE `trace`
  MODIFY `traceID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `traineebewerber`
--
ALTER TABLE `traineebewerber`
  MODIFY `traineebewerberID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `traineebewerber_ehrenamtlichschule`
--
ALTER TABLE `traineebewerber_ehrenamtlichschule`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `traineebewerber_ehrenamtlichstudium`
--
ALTER TABLE `traineebewerber_ehrenamtlichstudium`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `traineebewerber_hiwi`
--
ALTER TABLE `traineebewerber_hiwi`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `traineebewerber_praktikum`
--
ALTER TABLE `traineebewerber_praktikum`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `traineebewerber_sprache`
--
ALTER TABLE `traineebewerber_sprache`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `unternehmen`
--
ALTER TABLE `unternehmen`
  MODIFY `unternehmenID` int NOT NULL AUTO_INCREMENT;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `ansprechpartner`
--
ALTER TABLE `ansprechpartner`
  ADD CONSTRAINT `ansprechpartner_kontaktperson` FOREIGN KEY (`kontaktperson`) REFERENCES `mitglied` (`mitgliedID`),
  ADD CONSTRAINT `ansprechpartner_unternehmen` FOREIGN KEY (`unternehmen_unternehmenID`) REFERENCES `unternehmen` (`unternehmenID`);

--
-- Constraints der Tabelle `edvkenntnisse`
--
ALTER TABLE `edvkenntnisse`
  ADD CONSTRAINT `fk_EDVKenntnisse_Mitglied1` FOREIGN KEY (`mitglied_mitgliedID`) REFERENCES `mitglied` (`mitgliedID`);

--
-- Constraints der Tabelle `evposten`
--
ALTER TABLE `evposten`
  ADD CONSTRAINT `fk_evposten_ressort` FOREIGN KEY (`ressortID`) REFERENCES `ressort` (`ressortID`);

--
-- Constraints der Tabelle `evposten_has_berechtigung`
--
ALTER TABLE `evposten_has_berechtigung`
  ADD CONSTRAINT `fk_evposten_has_berechtigung_berechtigung` FOREIGN KEY (`berechtigung_berechtigungID`) REFERENCES `berechtigung` (`berechtigungID`),
  ADD CONSTRAINT `fk_evposten_has_berechtigung_evposten` FOREIGN KEY (`evposten_evpostenID`) REFERENCES `evposten` (`evpostenID`);

--
-- Constraints der Tabelle `generation_has_mentor`
--
ALTER TABLE `generation_has_mentor`
  ADD CONSTRAINT `fk_Generation` FOREIGN KEY (`generation_generationID`) REFERENCES `generation` (`generationID`),
  ADD CONSTRAINT `fk_Mitglied` FOREIGN KEY (`mitglied_mitgliedID`) REFERENCES `mitglied` (`mitgliedID`);

--
-- Constraints der Tabelle `hcwberatung`
--
ALTER TABLE `hcwberatung`
  ADD CONSTRAINT `fk_hcwberatung_hcw` FOREIGN KEY (`jahr`) REFERENCES `hcw` (`hcwJahr`);

--
-- Constraints der Tabelle `hcwbewerber`
--
ALTER TABLE `hcwbewerber`
  ADD CONSTRAINT `fk_hcwbewerber_hcw` FOREIGN KEY (`jahr`) REFERENCES `hcw` (`hcwJahr`);

--
-- Constraints der Tabelle `hcwbewerber_anlage`
--
ALTER TABLE `hcwbewerber_anlage`
  ADD CONSTRAINT `fk_hcwbewerber_anlage` FOREIGN KEY (`hcwbewerber_hcwbewerberID`) REFERENCES `hcwbewerber` (`hcwbewerberID`);

--
-- Constraints der Tabelle `hcwbewerber_has_beratung`
--
ALTER TABLE `hcwbewerber_has_beratung`
  ADD CONSTRAINT `fk_hcwbewerber_has_beratung_hcwberatung` FOREIGN KEY (`hcwberatung_hcwberatungID`) REFERENCES `hcwberatung` (`hcwberatungID`),
  ADD CONSTRAINT `fk_hcwbewerber_has_beratung_hcwbewerber` FOREIGN KEY (`hcwbewerber_hcwbewerberID`) REFERENCES `hcwbewerber` (`hcwbewerberID`);

--
-- Constraints der Tabelle `innovation`
--
ALTER TABLE `innovation`
  ADD CONSTRAINT `fk_autor` FOREIGN KEY (`autor`) REFERENCES `mitglied` (`mitgliedID`),
  ADD CONSTRAINT `fk_ressort` FOREIGN KEY (`ressortBeiEinreichung`) REFERENCES `ressort` (`ressortID`);

--
-- Constraints der Tabelle `internesprojekt_has_qm`
--
ALTER TABLE `internesprojekt_has_qm`
  ADD CONSTRAINT `fk_internesprojekt_qm_ip` FOREIGN KEY (`internesprojekt_internesprojektID`) REFERENCES `internesprojekt` (`internesprojektID`),
  ADD CONSTRAINT `fk_internesprojekt_qm_mitglied` FOREIGN KEY (`mitglied_mitgliedID`) REFERENCES `mitglied` (`mitgliedID`);

--
-- Constraints der Tabelle `kontaktaufnahme`
--
ALTER TABLE `kontaktaufnahme`
  ADD CONSTRAINT `kontaktaufnahme_ansprechpartner_fk` FOREIGN KEY (`ansprechpartner_ansprechpartnerID`) REFERENCES `ansprechpartner` (`ansprechpartnerID`),
  ADD CONSTRAINT `kontaktaufnahme_mitglied_fk` FOREIGN KEY (`mitglied_mitgliedID`) REFERENCES `mitglied` (`mitgliedID`);

--
-- Constraints der Tabelle `kurator_akquiriert`
--
ALTER TABLE `kurator_akquiriert`
  ADD CONSTRAINT `fk_kurator_akquiriert_kurator` FOREIGN KEY (`kurator_kuratorID`) REFERENCES `kurator` (`kuratorID`),
  ADD CONSTRAINT `fk_kurator_akquiriert_mitglied` FOREIGN KEY (`mitglied_mitgliedID`) REFERENCES `mitglied` (`mitgliedID`);

--
-- Constraints der Tabelle `mitglied`
--
ALTER TABLE `mitglied`
  ADD CONSTRAINT `fk_Mitglied_Generation` FOREIGN KEY (`generation`) REFERENCES `generation` (`generationID`),
  ADD CONSTRAINT `fk_Mitglied_Mitglied1` FOREIGN KEY (`mentor`) REFERENCES `mitglied` (`mitgliedID`),
  ADD CONSTRAINT `fk_Mitglied_Mitgliedstatus1` FOREIGN KEY (`mitgliedstatus`) REFERENCES `mitgliedstatus` (`mitgliedstatusID`),
  ADD CONSTRAINT `fk_Mitglied_Ressort1` FOREIGN KEY (`ressort`) REFERENCES `ressort` (`ressortID`);

--
-- Constraints der Tabelle `mitglied_has_andererposten`
--
ALTER TABLE `mitglied_has_andererposten`
  ADD CONSTRAINT `fk_mitglied_has_andererposten_andererposten` FOREIGN KEY (`andererposten_andererpostenID`) REFERENCES `andererposten` (`andererpostenID`),
  ADD CONSTRAINT `fk_mitglied_has_andererposten_mitglied` FOREIGN KEY (`mitglied_mitgliedID`) REFERENCES `mitglied` (`mitgliedID`);

--
-- Constraints der Tabelle `mitglied_has_berechtigung`
--
ALTER TABLE `mitglied_has_berechtigung`
  ADD CONSTRAINT `berechtigung_berechtigungID` FOREIGN KEY (`berechtigung_berechtigungID`) REFERENCES `berechtigung` (`berechtigungID`),
  ADD CONSTRAINT `mitglied_mitgliedID` FOREIGN KEY (`mitglied_mitgliedID`) REFERENCES `mitglied` (`mitgliedID`);

--
-- Constraints der Tabelle `mitglied_has_bueroraumreservierung`
--
ALTER TABLE `mitglied_has_bueroraumreservierung`
  ADD CONSTRAINT `fk_mitglied_has_bueroraumreservierung_bueroraum1` FOREIGN KEY (`bueroraum_bueroraumID`) REFERENCES `bueroraum` (`bueroraumID`),
  ADD CONSTRAINT `fk_mitglied_has_bueroraumreservierung_mitglied1` FOREIGN KEY (`mitglied_mitgliedID`) REFERENCES `mitglied` (`mitgliedID`);

--
-- Constraints der Tabelle `mitglied_has_event`
--
ALTER TABLE `mitglied_has_event`
  ADD CONSTRAINT `fk_mitglied_has_event_event1` FOREIGN KEY (`event_eventID`) REFERENCES `event` (`eventID`),
  ADD CONSTRAINT `fk_mitglied_has_event_mitglied1` FOREIGN KEY (`mitglied_mitgliedID`) REFERENCES `mitglied` (`mitgliedID`);

--
-- Constraints der Tabelle `mitglied_has_eventww`
--
ALTER TABLE `mitglied_has_eventww`
  ADD CONSTRAINT `fk_mitglied_has_eventww_event1` FOREIGN KEY (`event_eventID`) REFERENCES `event` (`eventID`),
  ADD CONSTRAINT `fk_mitglied_has_eventww_mitglied1` FOREIGN KEY (`mitglied_mitgliedID`) REFERENCES `mitglied` (`mitgliedID`);

--
-- Constraints der Tabelle `mitglied_has_evposten`
--
ALTER TABLE `mitglied_has_evposten`
  ADD CONSTRAINT `fk_Mitglied_has_EVposten_EVposten1` FOREIGN KEY (`evposten_evpostenID`) REFERENCES `evposten` (`evpostenID`),
  ADD CONSTRAINT `fk_Mitglied_has_EVposten_Mitglied1` FOREIGN KEY (`mitglied_mitgliedID`) REFERENCES `mitglied` (`mitgliedID`);

--
-- Constraints der Tabelle `mitglied_has_expertenwissen`
--
ALTER TABLE `mitglied_has_expertenwissen`
  ADD CONSTRAINT `fk_mitglied_has_expertenwissen_expertenwissen1` FOREIGN KEY (`expertenwissen_expertenwissenID`) REFERENCES `expertenwissen` (`expertenwissenID`),
  ADD CONSTRAINT `fk_mitglied_has_expertenwissen_mitglied1` FOREIGN KEY (`mitglied_mitgliedID`) REFERENCES `mitglied` (`mitgliedID`);

--
-- Constraints der Tabelle `mitglied_has_messenger`
--
ALTER TABLE `mitglied_has_messenger`
  ADD CONSTRAINT `fk_mitglied_has_messenger_messenger1` FOREIGN KEY (`messenger_messengerID`) REFERENCES `messenger` (`messengerID`),
  ADD CONSTRAINT `fk_mitglied_has_messenger_mitglied1` FOREIGN KEY (`mitglied_mitgliedID`) REFERENCES `mitglied` (`mitgliedID`);

--
-- Constraints der Tabelle `mitglied_has_projekt`
--
ALTER TABLE `mitglied_has_projekt`
  ADD CONSTRAINT `fk_projects_has_members_members1` FOREIGN KEY (`mitglied_mitgliedID`) REFERENCES `mitglied` (`mitgliedID`),
  ADD CONSTRAINT `fk_projects_has_members_projects` FOREIGN KEY (`projekt_projektID`) REFERENCES `projekt` (`projektID`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Constraints der Tabelle `mitglied_has_schulungsinstanz`
--
ALTER TABLE `mitglied_has_schulungsinstanz`
  ADD CONSTRAINT `fk_Schulunginstanz_has_Mitglied_Mitglied1` FOREIGN KEY (`mitglied_mitgliedID`) REFERENCES `mitglied` (`mitgliedID`),
  ADD CONSTRAINT `fk_Schulunginstanz_has_Mitglied_Schulunginstanz1` FOREIGN KEY (`schulungsinstanz_schulungsinstanzID`) REFERENCES `schulungsinstanz` (`schulungsinstanzID`);

--
-- Constraints der Tabelle `mitglied_has_status`
--
ALTER TABLE `mitglied_has_status`
  ADD CONSTRAINT `fk_mitglied_mitglied_has_status` FOREIGN KEY (`mitglied_mitgliedID`) REFERENCES `mitglied` (`mitgliedID`),
  ADD CONSTRAINT `fk_mitgliedstatus_mitglied_has_status` FOREIGN KEY (`mitgliedstatus_status`) REFERENCES `mitgliedstatus` (`mitgliedstatusID`);

--
-- Constraints der Tabelle `mmtracking_has_mitglied`
--
ALTER TABLE `mmtracking_has_mitglied`
  ADD CONSTRAINT `fk_mmtracking_has_mitglied_mitglied1` FOREIGN KEY (`mitglied_mitgliedID`) REFERENCES `mitglied` (`mitgliedID`),
  ADD CONSTRAINT `fk_mmtracking_has_mitglied_mmtracking1` FOREIGN KEY (`mmtracking_mmtrackingID`) REFERENCES `mmtracking` (`mmtrackingID`);

--
-- Constraints der Tabelle `passwort_reset`
--
ALTER TABLE `passwort_reset`
  ADD CONSTRAINT `fk_mitglied_jbt_email` FOREIGN KEY (`mitglied_jbt_email`) REFERENCES `mitglied` (`jbt_email`);

--
-- Constraints der Tabelle `praktika`
--
ALTER TABLE `praktika`
  ADD CONSTRAINT `fk_table1_Mitglied1` FOREIGN KEY (`mitglied_mitgliedID`) REFERENCES `mitglied` (`mitgliedID`);

--
-- Constraints der Tabelle `projekt`
--
ALTER TABLE `projekt`
  ADD CONSTRAINT `fk_akquiseverantw` FOREIGN KEY (`akquiseverantw`) REFERENCES `evposten` (`evpostenID`),
  ADD CONSTRAINT `fk_auftraggeber` FOREIGN KEY (`auftraggeber`) REFERENCES `unternehmen` (`unternehmenID`) ON DELETE CASCADE ON UPDATE RESTRICT,
  ADD CONSTRAINT `fk_branche` FOREIGN KEY (`branche_old`) REFERENCES `branche` (`brancheID`);

--
-- Constraints der Tabelle `projekt_has_ansprechpartner`
--
ALTER TABLE `projekt_has_ansprechpartner`
  ADD CONSTRAINT `projekt_has_ansprechpartner_ansprechpartner_fk` FOREIGN KEY (`ansprechpartner_ansprechpartnerID`) REFERENCES `ansprechpartner` (`ansprechpartnerID`),
  ADD CONSTRAINT `projekt_has_ansprechpartner_projekt_fk` FOREIGN KEY (`projekt_projektID`) REFERENCES `projekt` (`projektID`);

--
-- Constraints der Tabelle `projekt_has_kernkompetenz`
--
ALTER TABLE `projekt_has_kernkompetenz`
  ADD CONSTRAINT `fk_projekt_has_kernkompetenz_kernkompetenz1` FOREIGN KEY (`kernkompetenz_kernkompetenzID`) REFERENCES `kernkompetenz` (`kernkompetenzID`) ON DELETE CASCADE ON UPDATE RESTRICT,
  ADD CONSTRAINT `fk_projekt_has_kernkompetenz_projekt1` FOREIGN KEY (`projekt_projektID`) REFERENCES `projekt` (`projektID`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Constraints der Tabelle `schulungsfeedback`
--
ALTER TABLE `schulungsfeedback`
  ADD CONSTRAINT `fk_schulungsfeedback_schulungsinstanz1` FOREIGN KEY (`schulungsinstanz_schulungsinstanzID`) REFERENCES `schulungsinstanz` (`schulungsinstanzID`);

--
-- Constraints der Tabelle `schulungsfeedback_has_feedbackfrage`
--
ALTER TABLE `schulungsfeedback_has_feedbackfrage`
  ADD CONSTRAINT `fk_schulungsfeedback_has_feedbackfrage_feedbackfrage1` FOREIGN KEY (`feedbackfrage_feedbackfrageID`) REFERENCES `feedbackfrage` (`feedbackfrageID`),
  ADD CONSTRAINT `fk_schulungsfeedback_has_feedbackfrage_schulungsfeedback1` FOREIGN KEY (`schulungsfeedback_schulungsfeedbackID`) REFERENCES `schulungsfeedback` (`schulungsfeedbackID`);

--
-- Constraints der Tabelle `schulungsfeedback_has_mitglied`
--
ALTER TABLE `schulungsfeedback_has_mitglied`
  ADD CONSTRAINT `fk_schulungsfeedback_has_mitglied_mitglied1` FOREIGN KEY (`mitglied_mitgliedID`) REFERENCES `mitglied` (`mitgliedID`),
  ADD CONSTRAINT `fk_schulungsfeedback_has_mitglied_schulungsfeedback1` FOREIGN KEY (`schulungsfeedback_schulungsfeedbackID`) REFERENCES `schulungsfeedback` (`schulungsfeedbackID`);

--
-- Constraints der Tabelle `schulungsinstanz`
--
ALTER TABLE `schulungsinstanz`
  ADD CONSTRAINT `fk_Schulunginstanz_Schulungen1` FOREIGN KEY (`schulung_schulungID`) REFERENCES `schulung` (`schulungID`);

--
-- Constraints der Tabelle `session`
--
ALTER TABLE `session`
  ADD CONSTRAINT `fk_Session_mitglied1` FOREIGN KEY (`mitglied_mitgliedID`) REFERENCES `mitglied` (`mitgliedID`);

--
-- Constraints der Tabelle `sprachen`
--
ALTER TABLE `sprachen`
  ADD CONSTRAINT `fk_Sprachen_mitglied1` FOREIGN KEY (`mitglied_mitgliedID`) REFERENCES `mitglied` (`mitgliedID`);

--
-- Constraints der Tabelle `traineebewerber`
--
ALTER TABLE `traineebewerber`
  ADD CONSTRAINT `fk_aufgenommen_mitglied` FOREIGN KEY (`aufgenommen`) REFERENCES `mitglied` (`mitgliedID`),
  ADD CONSTRAINT `fk_traineebewerber_generation` FOREIGN KEY (`generation`) REFERENCES `generation` (`generationID`);

--
-- Constraints der Tabelle `traineebewerber_ehrenamtlichschule`
--
ALTER TABLE `traineebewerber_ehrenamtlichschule`
  ADD CONSTRAINT `fk_traineebewerber_ehrenamtlichschule` FOREIGN KEY (`traineebewerberID`) REFERENCES `traineebewerber` (`traineebewerberID`);

--
-- Constraints der Tabelle `traineebewerber_ehrenamtlichstudium`
--
ALTER TABLE `traineebewerber_ehrenamtlichstudium`
  ADD CONSTRAINT `fk_traineebewerber_ehrenamtlichstudium` FOREIGN KEY (`traineebewerberID`) REFERENCES `traineebewerber` (`traineebewerberID`);

--
-- Constraints der Tabelle `traineebewerber_hiwi`
--
ALTER TABLE `traineebewerber_hiwi`
  ADD CONSTRAINT `fk_traineebewerber_hiwi` FOREIGN KEY (`traineebewerberID`) REFERENCES `traineebewerber` (`traineebewerberID`);

--
-- Constraints der Tabelle `traineebewerber_praktikum`
--
ALTER TABLE `traineebewerber_praktikum`
  ADD CONSTRAINT `fk_traineebewerber_praktikum` FOREIGN KEY (`traineebewerberID`) REFERENCES `traineebewerber` (`traineebewerberID`);

--
-- Constraints der Tabelle `traineebewerber_sprache`
--
ALTER TABLE `traineebewerber_sprache`
  ADD CONSTRAINT `fk_traineebewerber_sprache` FOREIGN KEY (`traineebewerberID`) REFERENCES `traineebewerber` (`traineebewerberID`);

--
-- Constraints der Tabelle `unternehmen`
--
ALTER TABLE `unternehmen`
  ADD CONSTRAINT `unternehmen_branche_fk` FOREIGN KEY (`branche`) REFERENCES `branche` (`brancheID`) ON DELETE CASCADE ON UPDATE RESTRICT;