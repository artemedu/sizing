from django.shortcuts import render

# Create your views here.

from django.http import HttpResponse

# import os, time, glob, math

from .variables import *

from .compute import *
import json


def index(request):
    return render(request, 'DP_sizing_tool/sizing.html')


def YourViewsHere(request):
    def ListProcessing(list_name):
        tb = []
        list_name = list_name.split(',')
        for i in list_name:
            tb.append(float(i))
        return tb

    # var_dedupe_units_x relate to total backups (i.e. units for var_dedupe_site_detail_x)
    var_dedupe_units_0 = request.POST['var_dedupe_units_0'].split(',')
    print("var_dedupe_units_0", var_dedupe_units_0)

    var_dedupe_units_1 = request.POST['var_dedupe_units_1'].split(',')
    print("var_dedupe_units_1", var_dedupe_units_1)

    var_dedupe_units_2 = request.POST['var_dedupe_units_2'].split(',')
    print("var_dedupe_units_2", var_dedupe_units_2)

    # incremental backups from the first site including its copies to other sites; list of 3 lists [3x7]; single line so far
    var_dedupe_incremental_0 = request.POST['var_dedupe_incremental_0']
    var_dedupe_incremental_0 = ListProcessing(var_dedupe_incremental_0)

    # incremental backups from the second site including its copies to other sites; list of 3 lists [3x7]; single line so far
    var_dedupe_incremental_1 = request.POST['var_dedupe_incremental_1']
    var_dedupe_incremental_1 = ListProcessing(var_dedupe_incremental_1)

    # incremental backups from the third site including its copies to other sites; list of 3 lists [3x7]; single line so far
    var_dedupe_incremental_2 = request.POST['var_dedupe_incremental_2']
    var_dedupe_incremental_2 = ListProcessing(var_dedupe_incremental_2)

    # total backups including full and incremental backups in site 1; [1x7]
    var_dedupe_site_detail_0 = request.POST['var_dedupe_site_detail_0']
    var_dedupe_site_detail_0 = ListProcessing(var_dedupe_site_detail_0)
    print("var_dedupe_site_detail_0", var_dedupe_site_detail_0)

    # total backups including full and incremental backups in site 2; [1x7]
    var_dedupe_site_detail_1 = request.POST['var_dedupe_site_detail_1']
    var_dedupe_site_detail_1 = ListProcessing(var_dedupe_site_detail_1)
    print("var_dedupe_site_detail_1", var_dedupe_site_detail_1)

    # total backups including full and incremental backups in site 3; [1x7]
    var_dedupe_site_detail_2 = request.POST['var_dedupe_site_detail_2']
    var_dedupe_site_detail_2 = ListProcessing(var_dedupe_site_detail_2)
    print("var_dedupe_site_detail_2", var_dedupe_site_detail_2)

    # base image from the first site including its copies to other sites; list of 3 lists [3x7]; single line so far
    var_base_image_sizes11 = request.POST['var_base_image_sizes11']
    var_base_image_sizes11 = ListProcessing(var_base_image_sizes11)

    # base image from the second site including its copies to other sites; list of 3 lists [3x7]; single line so far
    var_base_image_sizes21 = request.POST['var_base_image_sizes21']
    var_base_image_sizes21 = ListProcessing(var_base_image_sizes21)

    # base image from the third site including its copies to other sites; list of 3 lists [3x7]; single line so far
    var_base_image_sizes31 = request.POST['var_base_image_sizes31']
    var_base_image_sizes31 = ListProcessing(var_base_image_sizes31)

    # base rep_imt from the first site including its copies to other sites; list of 3 lists [3x7]; single line so far
    var_base_rep_imt11 = request.POST['var_base_rep_imt11']
    var_base_rep_imt11 = ListProcessing(var_base_rep_imt11)

    # base rep_imt from the second site including its copies to other sites; list of 3 lists [3x7]; single line so far
    var_base_rep_imt21 = request.POST['var_base_rep_imt21']
    var_base_rep_imt21 = ListProcessing(var_base_rep_imt21)

    # base rep_imt from the third site including its copies to other sites; list of 3 lists [3x7]; single line so far
    var_base_rep_imt31 = request.POST['var_base_rep_imt31']
    var_base_rep_imt31 = ListProcessing(var_base_rep_imt31)

    # parse from single list to list of 3 lists
    var_dedupe_incremental_00 = [[0, 0, 0, 0, 0, 0, 0],
                                 [0, 0, 0, 0, 0, 0, 0],
                                 [0, 0, 0, 0, 0, 0, 0]]

    var_dedupe_incremental_00[0] = var_dedupe_incremental_0[0:7]
    var_dedupe_incremental_00[1] = var_dedupe_incremental_0[7:14]
    var_dedupe_incremental_00[2] = var_dedupe_incremental_0[14:21]
    print('var_dedupe_incremental_00', var_dedupe_incremental_00)

    # parse from single list to list of 3 lists
    var_dedupe_incremental_01 = [[0, 0, 0, 0, 0, 0, 0],
                                 [0, 0, 0, 0, 0, 0, 0],
                                 [0, 0, 0, 0, 0, 0, 0]]

    var_dedupe_incremental_01[0] = var_dedupe_incremental_1[0:7]
    var_dedupe_incremental_01[1] = var_dedupe_incremental_1[7:14]
    var_dedupe_incremental_01[2] = var_dedupe_incremental_1[14:21]
    print('var_dedupe_incremental_01', var_dedupe_incremental_01)

    # parse from single list to list of 3 lists
    var_dedupe_incremental_02 = [[0, 0, 0, 0, 0, 0, 0],
                                 [0, 0, 0, 0, 0, 0, 0],
                                 [0, 0, 0, 0, 0, 0, 0]]

    var_dedupe_incremental_02[0] = var_dedupe_incremental_2[0:7]
    var_dedupe_incremental_02[1] = var_dedupe_incremental_2[7:14]
    var_dedupe_incremental_02[2] = var_dedupe_incremental_2[14:21]
    print('var_dedupe_incremental_02', var_dedupe_incremental_02)

    var_base_image_sizes_00 = [[0, 0, 0, 0, 0, 0, 0],
                               [0, 0, 0, 0, 0, 0, 0],
                               [0, 0, 0, 0, 0, 0, 0]]

    var_base_image_sizes_00[0] = var_base_image_sizes11[0:7]
    var_base_image_sizes_00[1] = var_base_image_sizes11[7:14]
    var_base_image_sizes_00[2] = var_base_image_sizes11[14:21]
    print('var_base_image_sizes_00', var_base_image_sizes_00)

    var_base_image_sizes_01 = [[0, 0, 0, 0, 0, 0, 0],
                               [0, 0, 0, 0, 0, 0, 0],
                               [0, 0, 0, 0, 0, 0, 0]]

    var_base_image_sizes_01[0] = var_base_image_sizes21[0:7]
    var_base_image_sizes_01[1] = var_base_image_sizes21[7:14]
    var_base_image_sizes_01[2] = var_base_image_sizes21[14:21]
    print('var_base_image_sizes_01', var_base_image_sizes_01)

    var_base_image_sizes_02 = [[0, 0, 0, 0, 0, 0, 0],
                               [0, 0, 0, 0, 0, 0, 0],
                               [0, 0, 0, 0, 0, 0, 0]]

    var_base_image_sizes_02[0] = var_base_image_sizes31[0:7]
    var_base_image_sizes_02[1] = var_base_image_sizes31[7:14]
    var_base_image_sizes_02[2] = var_base_image_sizes31[14:21]
    print('var_base_image_sizes_02', var_base_image_sizes_02)

    var_base_rep_imt_00 = [[0, 0, 0, 0, 0, 0, 0],
                           [0, 0, 0, 0, 0, 0, 0],
                           [0, 0, 0, 0, 0, 0, 0]]

    var_base_rep_imt_00[0] = var_base_rep_imt11[0:7]
    var_base_rep_imt_00[1] = var_base_rep_imt11[7:14]
    var_base_rep_imt_00[2] = var_base_rep_imt11[14:21]
    print('var_base_rep_imt_00', var_base_rep_imt_00)

    var_base_rep_imt_01 = [[0, 0, 0, 0, 0, 0, 0],
                           [0, 0, 0, 0, 0, 0, 0],
                           [0, 0, 0, 0, 0, 0, 0]]

    var_base_rep_imt_01[0] = var_base_rep_imt21[0:7]
    var_base_rep_imt_01[1] = var_base_rep_imt21[7:14]
    var_base_rep_imt_01[2] = var_base_rep_imt21[14:21]
    print('var_base_rep_imt_01', var_base_rep_imt_01)

    var_base_rep_imt_02 = [[0, 0, 0, 0, 0, 0, 0],
                           [0, 0, 0, 0, 0, 0, 0],
                           [0, 0, 0, 0, 0, 0, 0]]

    var_base_rep_imt_02[0] = var_base_rep_imt31[0:7]
    var_base_rep_imt_02[1] = var_base_rep_imt31[7:14]
    var_base_rep_imt_02[2] = var_base_rep_imt31[14:21]
    print('var_base_rep_imt_02', var_base_rep_imt_02)



    print("my_var", calculations(var_dedupe_units_0, var_dedupe_units_1, var_dedupe_units_2,
                                 var_dedupe_site_detail_0, var_dedupe_site_detail_1, var_dedupe_site_detail_2,
                                 var_dedupe_incremental_00, var_dedupe_incremental_01, var_dedupe_incremental_02,
                                 var_base_image_sizes_00, var_base_image_sizes_01, var_base_image_sizes_02,
                                 var_base_rep_imt_00, var_base_rep_imt_01, var_base_rep_imt_02))

    (T_size, dedupe_units_detail, T_size_total, T_size_total_units, T_sizing, T_sizing_units) = \
        calculations(var_dedupe_units_0, var_dedupe_units_1, var_dedupe_units_2, var_dedupe_site_detail_0,
                     var_dedupe_site_detail_1, var_dedupe_site_detail_2, var_dedupe_incremental_00,
                     var_dedupe_incremental_01, var_dedupe_incremental_02, var_base_image_sizes_00,
                     var_base_image_sizes_01, var_base_image_sizes_02, var_base_rep_imt_00, var_base_rep_imt_01,
                     var_base_rep_imt_02)

    # Convert T_size from list of arrays to list of lists which is understood by JSON
    print('T_size', T_size)
    T_size[0] = T_size[0].tolist()
    T_size[1] = T_size[1].tolist()
    T_size[2] = T_size[2].tolist()
    print('T_size', T_size)

    data = {"T_size": T_size,
            "dedupe_units_detail": dedupe_units_detail,
            "T_size_total": T_size_total,
            "T_size_total_units": T_size_total_units,
            "T_sizing": T_sizing,
            "T_sizing_units": T_sizing_units}
    data = json.dumps(data)

    return HttpResponse(data)


