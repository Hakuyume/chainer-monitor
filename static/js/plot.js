'use strict';

import {Monitor} from "api";
import * from "color";

const monitor = new Monitor('./api');
const plot = monitor.plots.get(location.search.slice(1));

function update_series() {
    for (const yaxis of [0, 1]) {
        const tbody = $('#series-' + yaxis + ' > tbody');
        tbody.empty();
        for (const series of plot.series) {
            if (series.yaxis != yaxis)
                continue;

            const tr = $('<tr></tr>').appendTo(tbody);
            $('<td></td>').appendTo(tr).append(
                $('<input></input>')
                    .attr('type', 'color')
                    .attr('class', 'legend-color')
                    .attr('value', int2hex(series.color))
                    .on('change', function() {
                        series.modify({color: hex2int($(this).val())}).then(update_series);
                    }));
            $('<td></td>').appendTo(tr)
                .attr('width', '70%')
                .text(series.log.comment + ': ' + series.key);
            $('<td></td>').appendTo(tr).append(
                $('<button></button>')
                    .text('Delete')
                    .attr('type', 'button')
                    .attr('class', 'btn btn-danger btn-sm pull-right')
                    .on('click', () => plot.series.remove(series).then(update_series)));
        }
    }

    const used_colors = new Set();
    for (const series of plot.series)
        used_colors.add(series.color);
    if (used_colors.has(hex2int(dialog.color.val()))) {
        let color = Math.floor(Math.random() * (1 << 24));
        for (const c of colors) {
            if (!used_colors.has(c)) {
                color = c;
                break;
            }
        }
        dialog.color.val(int2hex(color));
    }

    update_chart();
}

let chart = null;
function update_chart() {
    const xunit = $('input[name=xunit]:checked').val();
    const npoint = $('input[name=npoint]:checked').val();
    const yscales = ['linear', 'linear'];
    for (const yaxis of [0, 1]) {
        if ($('#use-logscale-' + yaxis).is(':checked'))
            yscales[yaxis] = 'logarithmic';
        if (chart && chart.options.scales.yAxes[yaxis].type != yscales[yaxis]) {
            chart.destroy();
            chart = null;
        }
    }

    const xmin = 0;
    let xmax = 0;

    const datasets = [];
    for (const series of plot.series) {
        if (!series.log.content)
            continue;

        const data_with_key = []
        for (const entry of series.log.content)
            if (series.key in entry)
                data_with_key.push({x: entry[xunit], y: entry[series.key]});

        xmax = Math.max(xmax, data_with_key[data_with_key.length - 1].x);

        let interval = 1;
        if (npoint != '' && data_with_key.length > npoint) {
            interval = data_with_key.length / npoint;
        }

        const data = [];
        for (let i = 0; i < data_with_key.length; i += interval) {
            data.push(data_with_key[Math.floor(i)]);
        }

        datasets.push({
            label: series.log.comment,
            data: data,
            borderColor: int2rgb(series.color),
            yAxisID: 'y' + series.yaxis,
            pointDot: false,
            fill: false
        });
    }

    if (!chart){
        chart = new Chart($('#plot'), {
            type: 'line',
            data: {datasets: datasets},
            options: {
                elements: {
                    line: {tension: 0},
                },
                scales: {
                    xAxes: [{type: 'linear', position: 'bottom'}],
                    yAxes: [
                        {id: 'y0', type: yscales[0], position: 'left'},
                        {id: 'y1', type: yscales[1], position: 'right',
                         gridLines: {drawOnChartArea: false}}]
                },
                legend: {display: false},
                animation: false
            }
        });
    }

    chart.data.datasets = datasets;
    chart.options.scales.xAxes[0].ticks.min = xmin;
    chart.options.scales.xAxes[0].ticks.max = xmax;
    chart.update();
}

function update_dialog_open(yaxis) {
    dialog.log.prop('disabled', true);
    dialog.key.prop('disabled', true);
    dialog.yaxis.val([yaxis]);
    dialog.button.prop('disabled', true);

    monitor.logs.sync().then(() => {
        dialog.log.empty();
        $('<option></option>').appendTo(dialog.log);
        for (const log of monitor.logs)
            $('<option></option>')
            .appendTo(dialog.log)
            .attr('value', log.id)
            .text(log.comment);
        dialog.log.prop('disabled', false);
    });
}

function update_dialog_log(yaxis) {
    dialog.key.prop('disabled', true);
    dialog.button.prop('disabled', true);

    const id = dialog.log.val();
    if (!id)
        return;

    const log = monitor.logs.get(id);
    log.sync().then(() => {
        const keys = new Set();
        for (const entry of log.content)
            for (const key of Object.keys(entry))
                keys.add(key);

        dialog.key.empty();
        for (const key of keys) {
            if (key == 'iteration' || key == 'epoch')
                continue;
            $('<option></option>')
                .appendTo(dialog.key)
                .attr('value', key)
                .text(key);
        }
        dialog.key.prop('disabled', false);
    });
}

function update_dialog_key() {
    dialog.button.prop('disabled', false);
}

function add_series() {
    const data = {
        log: $('#dialog-log').val(),
        key: $('#dialog-key').val(),
        color: hex2int($('#dialog-color').val()),
        yaxis: $('input[name=dialog-yaxis]:checked').val(),
    };
    plot.series.add(data).then(update_series);
}

async function sync_logs() {
    const promises = [];
    for (const series of plot.series)
        promises.push(series.log.sync());
    await Promise.all(promises);
    update_chart();
}

let timer = null;
function set_timer() {
    if ($('#auto-update').prop('checked')) {
        if (!timer)
            timer = setInterval(sync_logs, 5000);
    } else {
        clearInterval(timer);
        timer = null;
    }
}

let dialog;
$(document).ready(() => {
    dialog = {
        log: $('#dialog-log'),
        key: $('#dialog-key'),
        color: $('#dialog-color'),
        yaxis: $('input[name=dialog-yaxis]'),
        button: $('#dialog-button'),
    };

    plot.sync().then(() => {
        update_series();
        sync_logs();
    });

    set_timer();
});
