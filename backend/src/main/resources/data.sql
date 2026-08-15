DELETE FROM card;
DELETE FROM list;
ALTER SEQUENCE list_id_seq RESTART WITH 1;
ALTER SEQUENCE card_id_seq RESTART WITH 1;

INSERT INTO list (title, position) VALUES
    ('未着手', 1),
    ('作業中', 2),
    ('完了', 3);

INSERT INTO card (list_id, title, position, priority) VALUES
    (1, '要件定義書を作成する', 1, '高'),
    (1, 'Docker環境を整える', 2, '中'),
    (2, 'タスク読み取りAPIを実装する', 1, '高'),
    (3, 'プロトタイプ画面を作成する', 1, '低');
