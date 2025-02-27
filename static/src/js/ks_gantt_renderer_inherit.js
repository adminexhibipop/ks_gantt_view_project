/** @odoo-module **/

import {ksGanttRenderer} from "@ks_gantt_view_base/js/ks_gantt_renderer_new";
import { patch } from "@web/core/utils/patch";
import { jsonrpc } from "@web/core/network/rpc_service";

patch(ksGanttRenderer.prototype,{
    setup(){
        super.setup()
    },

    willstart(){
        var ks_def;
      var ks_pub_hol;
      var ks_super = super.willstart();
      if (this.active_id && this.ks_model_name == "project.task") {
        ks_def = jsonrpc("/web/dataset/call_kw",{
          model: "project.project",
          method: "ks_project_config",
          args: [this.active_id],
          kwargs:{}
        }).then(
          function (result) {
            this.ks_project_start = result.ks_project_start
              ? result.ks_project_start
              : false;
            this.ks_project_end = result.ks_project_end
              ? result.ks_project_end
              : false;
            this.ks_enable_project_deadline = result.ks_enable_project_deadline;
            this.ks_enable_task_dynamic_text =
              result.ks_enable_task_dynamic_text;
            this.ks_enable_task_dynamic_progress =
              result.ks_enable_task_dynamic_progress;
            this.ks_enable_weekends = result.ks_enable_weekends;
            this.ks_days_off = result.ks_days_off;
            this.ks_days_off_selection = result.ks_days_off_selection;
            this.ks_enable_quickinfo_extension =
              result.ks_enable_quickinfo_extension;
            this.ks_project_tooltip_config = result.ks_project_tooltip_config
              ? result.ks_project_tooltip_config
              : false;
            this.ks_hide_date = result.ks_hide_date;
            this.ks_allow_subtasks = result.ks_allow_subtasks;
          }.bind(this)
        );
      }
      // Get Project Public Holiday list
      ks_pub_hol = jsonrpc("/web/dataset/call_kw",{
        model: "project.project",
        method: "ks_public_holidays",
        args: [],
        kwargs:{}
      }).then(
        function (result) {
          this.ks_exclude_holiday = result;
        }.bind(this)
      );

      return Promise.all([ks_def, ks_pub_hol, ks_super]);



    }
})
