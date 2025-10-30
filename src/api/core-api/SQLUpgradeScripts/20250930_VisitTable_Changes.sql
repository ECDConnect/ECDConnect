-- remove visitTypes not in use
delete from "VisitType" where "Type" in ('child', 'mother');
