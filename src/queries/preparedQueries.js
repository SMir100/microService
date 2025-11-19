// src/queries/preparedQueries.js

module.exports = {
  serviceType: {
    sql: "SELECT * FROM cm.domains WHERE dom_id = 10509",
    params: []
  },

  selEquGrid: {
    sql: `
      SELECT erg.id, erg.code, erg.title,
             d1.title AS dom_id_fault_type_title,
             d2.title AS dom_id_skill_level_title,
             erg.is_active,
             equ.title AS equ_id_region_title
      FROM pm.equipment_repair_groups erg
      INNER JOIN cm.domains d1 ON d1.id = dom_id_fault_type
      INNER JOIN cm.domains d2 ON d2.id = dom_id_skill_level
      INNER JOIN disp.equipments equ ON equ.id = erg.equ_id_region
      ORDER BY erg.id DESC
    `,
    params: []
  },

  selEquRegion: {
    sql: `
      SELECT *
      FROM disp.equipments
      WHERE row_type = 3 AND is_active = '1'
    `,
    params: []
  },

  selEquFilterGrid: {
    sql: `
      SELECT erg.id, erg.code, erg.title,
             d1.title AS dom_id_fault_type_title,
             d2.title AS dom_id_skill_level_title,
             erg.is_active,
             equ.title AS equ_id_region_title
      FROM pm.equipment_repair_groups erg
      INNER JOIN cm.domains d1 ON (d1.id = dom_id_fault_type AND d1.id = $1)
      INNER JOIN cm.domains d2 ON d2.id = dom_id_skill_level
      INNER JOIN disp.equipments equ ON (equ.id = erg.equ_id_region AND equ.id = $2)
      ORDER BY erg.id DESC
    `,
    params: ["type_id", "equ_id"]
  },

  skillLevelList: {
    sql: "SELECT * FROM cm.domains WHERE dom_id = 11490",
    params: []
  },

  contractorRepairGroup: {
    sql: `
      SELECT ORG.id,
             (ORG.code || '_' || ORG.title) AS inforrmation
      FROM pm.ORGANIZATIONS ORG
      INNER JOIN pm.ACCOUNT_ITEMS AI ON AI.REFERENCE_ID = ORG.ID
      WHERE ORG.type = 32 AND ORG.category = '5'
      ORDER BY ORG.code
    `,
    params: []
  },

  verifedPostLine: {
    sql: `
      SELECT e.id, e.title, et.dom_id_type
      FROM ast.assets e
      INNER JOIN ast.asset_types et ON (et.id = e.at_id)
      WHERE et.dom_id_type IN (10895,10896)
        AND ($1::int IS NULL OR et.dom_id_type = $1)
    `,
    params: ["dom_id"]
  },

  idBasedRepairGroups: {
    sql: "SELECT * FROM pm.equipment_repair_groups WHERE id = $1",
    params: ["recived_id"]
  },

  membersRepairGroup: {
    sql: `
      SELECT mem.id,
             dom.title AS type,
             mem.full_name,
             mem.start_date,
             mem.end_date
      FROM pm.equipment_repair_group_members mem
      INNER JOIN cm.domains dom ON (dom.id = mem.dom_id_type)
      WHERE erg_id = $1
      ORDER BY dom_id_type
    `,
    params: ["received_id"]
  },

  userTypeRepairGroup: {
    sql: "SELECT * FROM cm.domains WHERE dom_id = 11457 ORDER BY id",
    params: []
  },

  supervisorsMiantenance: {
    sql: `
      SELECT
          sup.id,
          sup.active,
          peo.name,
          peo.family,
          string_agg(DISTINCT equ.title, ',') AS units,
          string_agg(DISTINCT dom.title, ',') AS type
      FROM pm.maintenance_service_plan_supervisors sup
      INNER JOIN hm.people peo ON (peo.id = sup.peo_id)
      INNER JOIN disp.equipments equ
          ON equ.id = ANY(string_to_array(btrim(sup.equ_id_region), ',')::integer[])
      INNER JOIN cm.domains dom
          ON dom.id = ANY(string_to_array(btrim(sup.dom_id_type), ',')::integer[])
      GROUP BY sup.id, sup.active, peo.name, peo.family
      ORDER BY sup.id
    `,
    params: []
  },

  maintenanceSupervisorById: {
    sql: "SELECT * FROM pm.maintenance_service_plan_supervisors WHERE id = $1",
    params: ["sup_id"]
  },

  financeCycle: {
    sql: "SELECT * FROM PM.FINANCE_CYCLE",
    params: []
  },

  contractorsQuick: {
    sql: `
      SELECT
          ORG.*,
          CAST(ORG.CODE AS BIGINT) AS CODEINT,
          DOM_TYPE.TITLE AS TYPE_TITLE,
          CAST(0 AS BIT) AS SELECTED
      FROM pm.ORGANIZATIONS ORG
          LEFT JOIN cm.DOMAINS DOM_TYPE
              ON DOM_TYPE.CODE = CAST(ORG.TYPE AS varchar(10))
             AND DOM_TYPE.DOM_ID = 223
      WHERE
          (ORG.TYPE & 1 > 0
           AND CATEGORY = '10'
           AND COALESCE(ORG.MODIFY_STATUS, '1') > '0')
          OR ORG.ID IN (
              SELECT CAST(VALUE AS int)
              FROM cm.CONFIGURATIONS
              WHERE DOM_ID_TYPE = 3643
          )
      ORDER BY ORG.ID
    `,
    params: []
  },

  priceList: {
    sql: `
      SELECT
          upl.id,
          upl.no_base_price,
          upl.code,
          upl.title,
          upl.price,
          upl.unit,
          dom.title AS service,
          equ.title AS region,
          upl.equ_id_region,
          ci.con_id
      FROM pm.contract_items ci
      INNER JOIN pm.seller_items si ON ci.si_id = si.id
      INNER JOIN pm.sellers s ON si.sel_id = s.id
      INNER JOIN pm.service_request_items sri ON si.srv_item_id = sri.id
      INNER JOIN pm.utilization_price_list upl ON upl.goo_id = sri.goo_id
      INNER JOIN cm.domains dom ON upl.dom_id_service_type = dom.id
      INNER JOIN disp.equipments equ ON upl.equ_id_region = equ.id
      WHERE upl.dom_id_type = 11621
        AND ci.con_id = $1

      UNION ALL

      SELECT
          upl.id,
          upl.no_base_price,
          upl.code,
          upl.title,
          upl.price,
          upl.unit,
          dom.title AS service,
          equ.title AS region,
          upl.equ_id_region,
          cr.con_id
      FROM pm.contract_riders cr
      INNER JOIN pm.contract_rider_items cri ON cri.con_ride_id = cr.id
      INNER JOIN pm.utilization_price_list upl ON upl.goo_id = cri.goo_id
      INNER JOIN cm.domains dom ON upl.dom_id_service_type = dom.id
      INNER JOIN disp.equipments equ ON upl.equ_id_region = equ.id
      WHERE upl.dom_id_type = 11621
        AND cr.con_id = $1
    `,
    params: ["p_conid"]
  }
};
