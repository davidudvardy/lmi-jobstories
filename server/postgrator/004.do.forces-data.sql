INSERT INTO forces (id, description, direction) VALUES('1','Positive force which makes it easier','positive');
INSERT INTO forces (id, description, direction) VALUES('2','Negative force or an anxiety','negative');
INSERT INTO forces (id, description, direction) VALUES('3','Negative force which makes it harder','negative');
SELECT setval('forces_id_seq', 3);

UPDATE jobstories SET forces_ids='{1,3}' WHERE id=1;
UPDATE jobstories SET forces_ids='{1,2,3}' WHERE id=2;
UPDATE jobstories SET forces_ids='{1,3}' WHERE id=3;
UPDATE jobstories SET forces_ids='{1}' WHERE id=4;
UPDATE jobstories SET forces_ids='{1,2}' WHERE id=5;
