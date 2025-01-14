CREATE TABLE public."Holidays" (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Day DATE NOT NULL,
    Locale VARCHAR(10) NOT NULL
);
