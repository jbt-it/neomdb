--
-- Daten für Tabelle `mitgliedstatus optional`
--
SET FOREIGN_KEY_CHECKS = 0;

INSERT INTO `mitgliedstatus` (`mitgliedstatusID`, `bezeichnung`) VALUES
(1, 'Trainee'),
(2, 'aktives Mitglied'),
(3, 'Senior'),
(4, 'passives Mitglied'),
(5, 'Alumnus'),
(6, 'Ausgetretene');

--
-- Daten für Tabelle `berechtigung`
--

INSERT INTO `berechtigung` (`berechtigungID`, `bezeichnung`, `beschreibung`) VALUES
(1, 'Mitgliederverwaltung', 'Mitglieder hinzufügen, löschen, beliebige Profile bearbeiten'),
(2, 'PL/QM Tool', 'PL/QM-Befähigungen eintragen (anschauen kann jeder)'),
(3, 'MM-Tracking', 'MM-Tracking eintragen (anschauen kann jeder)'),
(4, 'Workshopverwaltung', 'Workshops eintragen, Teilnehmer auswählen, Feedbackphase starten, Feedback einsehen'),
(5, 'Ausgetretene', 'Ausgetretene Mitglieder sehen'),
(6, 'Finanzdaten', 'Finanzdaten aller Mitglieder sehen'),
(7, 'Vertragsablage', 'Vorhandensein von Beratungsvertrag, Teamvertrag und VfM bei Projekten in der Abrechnungsphase markieren'),
(8, 'Terminverwaltung', 'Termine hinzufügen, bearbeiten, Anmeldungen einsehen, WW eintragen'),
(9, 'Traineebewerbung', 'Backend des Traineebewerbungstools einsehen (aber keine Rechte zur Änderung)'),
(10, 'Hilfetexte', 'Beliebiger Hilfetexte der MDB bearbeiten'),
(11, 'Dokumentenablage_QM', 'Vorhandensein von AP, Evaluation, DL und Angebot bei Projekten in der Abrechnungsphase markieren, außerdem QM-Freigabe und Abweichung vom Standard setzen'),
(12, 'HCW-Bewerbung', 'Backend des HCW-Bewerbungstools einsehen (aber keine Rechte zur Änderung), Bewerber einsehen und löschen'),
(13, 'CRM', 'Alle Unternehmen (auch geheime) sehen und bearbeiten, Ansprechpartner und Kontaktaufnahmen eintragen'),
(14, 'Traineewahl', 'Wahl von Mentor, Ressort und IP für neue Traineegenerationen starten und auswerten'),
(15, 'Interne Projekte', 'Interne Projekte verwalten'),
(16, 'Traineebewerbung Admin', 'Traineebewerbung starten, Bewerber einladen, Beweber als Trainees aufnehmen'),
(17, 'HCW-Bewerbung Admin', 'HCW-Bewerbung starten, Beratungen/Accounts hinzufügen'),
(18, 'Mitgliedsaufnahme', 'Trainees nach Erfüllung aller Kriterien im Traineebereich als Mitglieder aufnehmen'),
(19, 'Projektausschreibung', 'Projekte ausschreiben, nach Bewerbungsphase Projektteam zusammenstellen, bestehende Projekte bearbeiten'),
(20, 'Mitglieder-Notizen', 'Notizen zu Mitgliedern (auf der Profilseite) sehen und bearbeiten'),
(21, 'Projektbewerbungen', 'Projektbewerbungen für aktuelle und alte Projekte einsehen'),
(22, 'Projektabrechnung', 'Projektabrechnungsphase starten und beenden, Checkpoints zu Überweisungen/Zahlungsverzug setzen'),
(23, 'Kuratorenverwaltung', 'Kuratoren anlegen, bearbeiten, entfernen und die geschützten Dokumentations-Felder für Kuratoren sehen'),
(24, 'Innovationsmanagement', 'Eingereichte Ideen einsehen, bewerten, Status ändern'),
(100, 'MDB-Admin', 'Diverse Berechtigungen zur technischen Administration und Entwicklung der MDB');

--
-- Daten für Tabelle `evposten_has_berechtigung`
--

INSERT INTO `evposten_has_berechtigung` (`evposten_evpostenID`, `berechtigung_berechtigungID`, `canDelegate`) VALUES
(1, 1, 0),
(1, 2, 0),
(1, 3, 0),
(1, 4, 0),
(1, 8, 1),
(1, 9, 0),
(1, 10, 0),
(1, 14, 0),
(1, 15, 0),
(1, 16, 0),
(1, 18, 0),
(1, 20, 0),
(1, 21, 0),
(1, 23, 0),
(2, 4, 1),
(2, 8, 0),
(2, 10, 0),
(2, 11, 1),
(2, 15, 0),
(2, 24, 1),
(3, 6, 1),
(3, 7, 1),
(3, 10, 0),
(3, 22, 0),
(4, 2, 1),
(4, 3, 0),
(4, 8, 1),
(4, 10, 0),
(4, 13, 1),
(4, 19, 0),
(4, 21, 0),
(8, 10, 1),
(8, 100, 0),
(10, 1, 1),
(10, 2, 1),
(10, 3, 1),
(10, 4, 1),
(10, 5, 0),
(10, 8, 1),
(10, 9, 1),
(10, 10, 0),
(10, 12, 1),
(10, 14, 0),
(10, 15, 1),
(10, 16, 1),
(10, 17, 1),
(10, 18, 0),
(10, 20, 0),
(11, 3, 1),
(11, 4, 0),
(11, 8, 0),
(11, 23, 1),
(14, 10, 0),
(44, 2, 1),
(44, 3, 0),
(44, 8, 1),
(44, 10, 0),
(44, 13, 1),
(44, 19, 0),
(44, 21, 0);

SET FOREIGN_KEY_CHECKS = 1