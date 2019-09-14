-- View: pgmodrev.contributor

-- DROP VIEW pgmodrev.contributor;

CREATE OR REPLACE VIEW pgmodrev.contributor AS
 SELECT max(adh.adh_hist_cle) AS id,
    max(adh.adh_hist_ur::text) AS code_ur,
    adh.adh_hist_cpt_ext AS contributor_id,
    max(adha.start) AS start,
    max(adha.subscribtion_date) AS subscribtion_date,
    max(adhd."end") AS "end",
    max(adhd.unsubscribtion_date) AS unsubscribtion_date
   FROM pgmodrev.adhesion_hist adh
     JOIN ( SELECT adhesion_hist.adh_hist_cpt_ext,
            max(adhesion_hist.adh_hist_date_effet) AS start,
            max(adhesion_hist.adh_hist_date) AS subscribtion_date
           FROM pgmodrev.adhesion_hist
          WHERE adhesion_hist.adh_hist_mvt::text = ANY (ARRAY['ADH'::character varying, 'AND'::character varying]::text[])
          GROUP BY adhesion_hist.adh_hist_cpt_ext) adha ON adha.adh_hist_cpt_ext::text = adh.adh_hist_cpt_ext::text
     LEFT JOIN ( SELECT adhesion_hist.adh_hist_cpt_ext,
            max(adhesion_hist.adh_hist_date_effet) AS "end",
            max(adhesion_hist.adh_hist_date) AS unsubscribtion_date
           FROM pgmodrev.adhesion_hist
          WHERE adhesion_hist.adh_hist_mvt::text = ANY (ARRAY['RES'::character varying, 'ANA'::character varying]::text[])
          GROUP BY adhesion_hist.adh_hist_cpt_ext) adhd ON adhd.adh_hist_cpt_ext::text = adh.adh_hist_cpt_ext::text
  GROUP BY adh.adh_hist_cpt_ext;

ALTER TABLE pgmodrev.contributor
  OWNER TO pgmodrev;
