DELETE FROM card;
DELETE FROM list;
ALTER SEQUENCE list_id_seq RESTART WITH 1;
ALTER SEQUENCE card_id_seq RESTART WITH 1;

INSERT INTO list (title, position) VALUES
    ('未着手', 1),
    ('作業中', 2),
    ('完了', 3);

INSERT INTO card (list_id, title, position, priority) VALUES
    (1, '未着手1', 1, '高'),
    (2, '作業中1', 1, '高'),
    (3, '完了1', 1, '低');
    (1, '未着手2', 2, '高'),
    (2, '作業中2', , '高'),
    (3, '完了2', 2, '低');
    (1, '未着手3', 3, '高'),
    (2, '作業中3', 3, '高'),
    (3, '完了3', 3, '低');
