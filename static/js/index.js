'use strict';

import {Monitor} from "api";

const monitor = new Monitor('./api');

function update_plots() {
    const tbody = $('#plots > tbody');
    tbody.empty();
    for (const plot of monitor.plots) {
        const tr = $('<tr></tr>').appendTo(tbody);
        $('<td></td>').appendTo(tr).append(
            $('<a></a>')
                .text((plot.comment != '') ? plot.comment : '<no comment>')
                .attr('href', './plot?' + plot.id));
        $('<td></td>').appendTo(tr).attr('class', 'col-md-1').append(
            $('<button></button>')
                .text('Delete')
                .attr('type', 'button')
                .attr('class', 'btn btn-danger')
                .on('click', () => monitor.plots.remove(plot).then(update_plots))
        );
    }
}

function update_logs() {
    const tbody = $('#logs > tbody');
    tbody.empty();
    for (const log of monitor.logs) {
        const tr = $('<tr></tr>').appendTo(tbody);
        $('<td></td>').appendTo(tr).text(log.path);
        $('<td></td>').appendTo(tr).text(log.comment);
        $('<td></td>').appendTo(tr).attr('class', 'col-md-1').append(
            $('<button></button>')
                .text('Delete')
                .attr('type', 'button')
                .attr('class', 'btn btn-danger')
                .on('click', () => monitor.logs.remove(log).then(update_logs))
        );
    }
}

function add_plot() {
    const text = $('#comment');
    monitor.plots.add({comment: text.val()})
        .then(() => {
            update_plots();
            text.val('');
        });
}

$(document).ready(() => {
    monitor.plots.sync().then(update_plots);
    monitor.logs.sync().then(update_logs);
});
