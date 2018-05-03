from django.conf.urls import url
from . import views
from .views import *
from .variables import *
import numpy as np

# my_func = views.YourViewsHere(request)
# test_qq = views.YourViewsHere(request).var_dedupe_incremental_00
# exch_first = variables.exch_first
# exch_follow = variables.exch_follow


def calculations(var_dedupe_units_0, var_dedupe_units_1, var_dedupe_units_2,
                 var_dedupe_site_detail_0, var_dedupe_site_detail_1, var_dedupe_site_detail_2,
                 var_dedupe_incremental_00, var_dedupe_incremental_01, var_dedupe_incremental_02,
                 var_base_image_sizes_00, var_base_image_sizes_01, var_base_image_sizes_02,
                 var_base_rep_imt_00, var_base_rep_imt_01, var_base_rep_imt_02):
    var_dedupe_incremental_00 = np.array([np.array(xi) for xi in var_dedupe_incremental_00])  # incremental backups from the first site including its copies to other sites
    var_dedupe_incremental_01 = np.array([np.array(xi) for xi in var_dedupe_incremental_01])  # incremental backups from the second site including its copies to other sites
    var_dedupe_incremental_02 = np.array([np.array(xi) for xi in var_dedupe_incremental_02])  # incremental backups from the third site including its copies to other sites
    var_base_image_sizes_00 = np.array([np.array(xi) for xi in var_base_image_sizes_00])  # base image from the first site including its copies to other sites
    var_base_image_sizes_01 = np.array([np.array(xi) for xi in var_base_image_sizes_01])  # base image from the second site including its copies to other sites
    var_base_image_sizes_02 = np.array([np.array(xi) for xi in var_base_image_sizes_02])  # base image from the third site including its copies to other sites
    var_base_rep_imt_00 = np.array([np.array(xi) for xi in var_base_rep_imt_00])  # base rep_imt from the first site including its copies to other sites
    var_base_rep_imt_01 = np.array([np.array(xi) for xi in var_base_rep_imt_01])  # base rep_imt from the second site including its copies to other sites
    var_base_rep_imt_02 = np.array([np.array(xi) for xi in var_base_rep_imt_02])  # base rep_imt from the third site including its copies to other sites

    var_dedupe_units = [[0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0]]

    var_dedupe_units[0] = var_dedupe_units_0
    var_dedupe_units[1] = var_dedupe_units_1
    var_dedupe_units[2] = var_dedupe_units_2

    var_dedupe_units = np.array([np.array(xi) for xi in var_dedupe_units])

    # total backups including full and incremental backups
    var_dedupe_site_detail = [[0, 0, 0, 0, 0, 0, 0],
                              [0, 0, 0, 0, 0, 0, 0],
                              [0, 0, 0, 0, 0, 0, 0]]

    var_dedupe_site_detail[0] = var_dedupe_site_detail_0
    var_dedupe_site_detail[1] = var_dedupe_site_detail_1
    var_dedupe_site_detail[2] = var_dedupe_site_detail_2

    var_dedupe_site_detail = np.array([np.array(xi) for xi in var_dedupe_site_detail])

    # convert total backups (including full and incremental backups) into GBs
    for cc in range(0, 3):
        for r in range(0, 7):
            if var_dedupe_units[cc][r] == "TB":
                var_dedupe_site_detail[cc][r] = var_dedupe_site_detail[cc][r] * 1024
            elif var_dedupe_units[cc][r] == "PB":
                var_dedupe_site_detail[cc][r] = var_dedupe_site_detail[cc][r] * 1024 * 1024
            else:
                var_dedupe_site_detail[cc][r] = var_dedupe_site_detail[cc][r]

    # full backups (including full backups from other sites but without incremental backups and their copies) per site per server/data type
    dedupe_full = var_dedupe_site_detail - var_dedupe_incremental_00 - var_dedupe_incremental_01 - var_dedupe_incremental_02

    first_arr = [exch_first, oracle_first, sql_first, shares_first, engineering_first, uncompressible_first, vm_first]
    follow_arr = [exch_follow, oracle_follow, sql_follow, shares_follow, engineering_follow, uncompressible_follow, vm_follow]
    compr_arr = [exch_compr, oracle_compr, sql_compr, shares_compr, engineering_compr, uncompressible_compr, vm_compr]
    incr_arr = [exch_incr, oracle_incr, sql_incr, shares_incr, engineering_incr, uncompressible_incr, vm_incr]

    # deduplicated full backups
    dedupe_full = dedupe_full * follow_arr * compr_arr

    # incremental backups per site (including their copies from other sites)
    dedupe_incremental_site1 = var_dedupe_incremental_00[0] + var_dedupe_incremental_01[0] + var_dedupe_incremental_02[0]
    dedupe_incremental_site2 = var_dedupe_incremental_00[1] + var_dedupe_incremental_01[1] + var_dedupe_incremental_02[1]
    dedupe_incremental_site3 = var_dedupe_incremental_00[2] + var_dedupe_incremental_01[2] + var_dedupe_incremental_02[2]

    # deduplicated incremental backups
    dedupe_incremental_site1 = dedupe_incremental_site1 * incr_arr * compr_arr
    dedupe_incremental_site2 = dedupe_incremental_site2 * incr_arr * compr_arr
    dedupe_incremental_site3 = dedupe_incremental_site3 * incr_arr * compr_arr

    # total deduped capacity per site (but not including base data sizes)
    T_size = [0, 0, 0]

    T_size[0] = dedupe_full[0] + dedupe_incremental_site1
    T_size[1] = dedupe_full[1] + dedupe_incremental_site2
    T_size[2] = dedupe_full[2] + dedupe_incremental_site3

    base_image_sizes11_0 = var_base_image_sizes_00[0] * first_arr * compr_arr
    base_rep_imt11_0 = var_base_rep_imt_00[0] * follow_arr * compr_arr
    base11_0 = base_image_sizes11_0 - base_rep_imt11_0

    base_image_sizes21_0 = var_base_image_sizes_01[0] * first_arr * compr_arr
    base_rep_imt21_0 = var_base_rep_imt_01[0] * follow_arr * compr_arr
    base21_0 = base_image_sizes21_0 - base_rep_imt21_0

    base_image_sizes31_0 = var_base_image_sizes_02[0] * first_arr * compr_arr
    base_rep_imt31_0 = var_base_rep_imt_02[0] * follow_arr * compr_arr
    base31_0 = base_image_sizes31_0 - base_rep_imt31_0


    base_image_sizes11_1 = var_base_image_sizes_00[1] * first_arr * compr_arr
    base_rep_imt11_1 = var_base_rep_imt_00[1] * follow_arr * compr_arr
    base11_1 = base_image_sizes11_1 - base_rep_imt11_1

    base_image_sizes21_1 = var_base_image_sizes_01[1] * first_arr * compr_arr
    base_rep_imt21_1 = var_base_rep_imt_01[1] * follow_arr * compr_arr
    base21_1 = base_image_sizes21_1 - base_rep_imt21_1

    base_image_sizes31_1 = var_base_image_sizes_02[1] * first_arr * compr_arr
    base_rep_imt31_1 = var_base_rep_imt_02[1] * follow_arr * compr_arr
    base31_1 = base_image_sizes31_1 - base_rep_imt31_1


    base_image_sizes11_2 = var_base_image_sizes_00[2] * first_arr * compr_arr
    base_rep_imt11_2 = var_base_rep_imt_00[2] * follow_arr * compr_arr
    base11_2 = base_image_sizes11_2 - base_rep_imt11_2

    base_image_sizes21_2 = var_base_image_sizes_01[2] * first_arr * compr_arr
    base_rep_imt21_2 = var_base_rep_imt_01[2] * follow_arr * compr_arr
    base21_2 = base_image_sizes21_2 - base_rep_imt21_2

    base_image_sizes31_2 = var_base_image_sizes_02[2] * first_arr * compr_arr
    base_rep_imt31_2 = var_base_rep_imt_02[2] * follow_arr * compr_arr
    base31_2 = base_image_sizes31_2 - base_rep_imt31_2

    base11 = base11_0 + base21_0 + base31_0
    base21 = base11_1 + base21_1 + base31_1
    base31 = base11_2 + base21_2 + base31_2

    # total deduped capacity per site per server/data type (including base data sizes)
    T_size[0] = T_size[0] + base11
    T_size[1] = T_size[1] + base21
    T_size[2] = T_size[2] + base31

    # total deduped capacity per site (i.e. site totals); we make data copies and then process them.
    T_size_total_0 = T_size[0]
    T_size_total_1 = T_size[1]
    T_size_total_2 = T_size[2]

    T_size_total = [0, 0, 0]
    T_size_total_units = [0, 0, 0]
    T_size_total[0] = np.sum(T_size_total_0)
    T_size_total[1] = np.sum(T_size_total_1)
    T_size_total[2] = np.sum(T_size_total_2)

    # conversion of total deduped capacity per site (i.e. site totals) from GBs into PBs, TBs, or leave in GBs.
    for hi in range(0, 3):
        if T_size_total[hi] >= (1024 * 1024):
            T_size_total[hi] = T_size_total[hi] / (1024 * 1024)
            T_size_total_units[hi] = "PB"
        elif T_size_total[hi] >= 1024:
            T_size_total[hi] = T_size_total[hi] / 1024
            T_size_total_units[hi] = "TB"
        elif T_size_total[hi] < 1024:
            T_size_total[hi] = T_size_total[hi]
            T_size_total_units[hi] = "GB"

    # total capacity per site to be presented on the main reporting page
    T_size_temp_0 = T_size[0]
    T_size_temp_1 = T_size[1]
    T_size_temp_2 = T_size[2]

    T_sizing = [0, 0, 0]
    T_sizing_units = ['TB', 'TB', 'TB']
    T_sizing[0] = np.sum(T_size_temp_0) / 1024
    T_sizing[1] = np.sum(T_size_temp_1) / 1024
    T_sizing[2] = np.sum(T_size_temp_2) / 1024

    # conversion of total deduped capacity per site per data/server type from GBs into PBs, TBs, or leave in GBs.
    dedupe_units_detail = [[0, 0, 0, 0, 0, 0, 0],
                           [0, 0, 0, 0, 0, 0, 0],
                           [0, 0, 0, 0, 0, 0, 0]]

    for hh in range(0, 3):
        for pp in range(0, 7):
            if T_size[hh][pp] >= (1024 * 1024):
                T_size[hh][pp] = T_size[hh][pp] / (1024 * 1024)
                dedupe_units_detail[hh][pp] = "PB"
            elif T_size[hh][pp] >= 1024:
                T_size[hh][pp] = T_size[hh][pp] / 1024
                dedupe_units_detail[hh][pp] = "TB"
            elif T_size[hh][pp] < 1024:
                T_size[hh][pp] = T_size[hh][pp]
                dedupe_units_detail[hh][pp] = "GB"

#    overhead = [0, 0, 0]

#    for mm in range(0, 3):
#        if T_sizing[mm] > 54 or T_sizing[mm] == 54:
#            overhead[mm] = 10 / 100
#        elif T_sizing[mm] < 54:
#            overhead[mm] = 20 / 100

#    arguments = locals()
#    arguments.items() = np.array([np.array(xi) for xi in arguments.items()])

    return (T_size, dedupe_units_detail,
            T_size_total, T_size_total_units,
            T_sizing, T_sizing_units)
