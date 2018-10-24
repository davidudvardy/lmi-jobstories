INSERT INTO jobstories (id, context_id, motivation_id, outcome_id, usertype_ids) VALUES('1','1','1','1','{bold360-end-user,bold360-analyst}');
INSERT INTO jobstories (id, context_id, motivation_id, outcome_id, usertype_ids) VALUES('2','2','2','2','{bold360-end-user}');
INSERT INTO jobstories (id, context_id, motivation_id, outcome_id, usertype_ids) VALUES('3','3','3','3','{bold360-end-user}');
INSERT INTO jobstories (id, context_id, motivation_id, outcome_id, usertype_ids) VALUES('4','4','4','4','{bold360-analyst,bold360-end-user}');
INSERT INTO jobstories (id, context_id, motivation_id, outcome_id, usertype_ids) VALUES('5','5','5','5','{prompt-content-editor}');
SELECT setval('jobstories_id_seq', 5);


INSERT INTO contexts (id, description) VALUES('1','When my problem was not resolved and I was asked for detailed feedback on the interaction');
INSERT INTO contexts (id, description) VALUES('5','When I open a chat window');
INSERT INTO contexts (id, description) VALUES('2','When I get wordy instructions within a conversation and the topic is quite complex and largely unknown to me');
INSERT INTO contexts (id, description) VALUES('3','When I act upon chatbot instructions');
INSERT INTO contexts (id, description) VALUES('4','When I get irrelevant/inaccurate responses through a chatbot');
SELECT setval('contexts_id_seq', 5);


INSERT INTO motivations (id, description) VALUES('1','I want to easily continue the chat and keep browsing at the same time');
INSERT INTO motivations (id, description) VALUES('2','I want to be quickly directed to the corresponding pages I need to act upon');
INSERT INTO motivations (id, description) VALUES('3','I want to follow instructions one step at a time');
INSERT INTO motivations (id, description) VALUES('4','I want to get a relevant and personalized response as soon as possible');
INSERT INTO motivations (id, description) VALUES('5','I do not want to give any feedback');
SELECT setval('motivations_id_seq', 5);


INSERT INTO outcomes (id, description) VALUES('1','So that I do not have to memorize instructions, and switch back and forth between instructions and the website.');
INSERT INTO outcomes (id, description) VALUES('2','So that I can act upon instructions quickly and get back to what I was doing.');
INSERT INTO outcomes (id, description) VALUES('3','So I can focus on solving my problem first.');
INSERT INTO outcomes (id, description) VALUES('4','So I do not spend too much time searching for specific pages.');
INSERT INTO outcomes (id, description) VALUES('5','So that I can feel confident about the response and act upon it.');
SELECT setval('outcomes_id_seq', 5);


INSERT INTO products (id, title) VALUES('bold360','Bold360');
INSERT INTO products (id, title) VALUES('prompt','Prompt AI');


INSERT INTO usertypes (id, title, product_id) VALUES('prompt-content-editor','Content Editor','prompt');
INSERT INTO usertypes (id, title, product_id) VALUES('bold360-end-user','End User','bold360');
INSERT INTO usertypes (id, title, product_id) VALUES('bold360-analyst','Analyst','bold360');
