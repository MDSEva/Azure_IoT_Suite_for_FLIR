IoTApp.createModule(
    'IoTApp.Dashboard.TelemetryHistorySummary',
    function initTelemetryHistorySummary() {
        'use strict';

        var averageDeviceTemperatureContainer;
        var averageDeviceTemperatureControl;
        var averageDeviceTemperatureLabel;
        var averageTemperatureVisual;
        var lastAvgTemperature;
        var lastMaxTemperature;
        var lastMinTemperature;
        var maxDeviceTemperatureContainer;
        var maxDeviceTemperatureControl;
        var maxDeviceTemperatureLabel;
        var maxTemperatureVisual;
        var maxValue;
        var minDeviceTemperatureContainer;
        var minDeviceTemperatureControl;
        var minDeviceTemperatureLabel;
        var minTemperatureVisual;
        var minValue;

        var createDataView = function createDataView(indicatedValue) {

            var categoryMetadata;
            var dataView;
            var dataViewTransform;
            var graphMetadata;

            dataViewTransform = powerbi.data.DataViewTransform;

            graphMetadata = {
                columns: [
                    {
                        isMeasure: true,
                        roles: { 'Y': true },
                        objects: { general: { formatString: resources.telemetryGaugeNumericFormat } },
                    },
                    {
                        isMeasure: true,
                        roles: { 'MinValue': true },
                    },
                    {
                        isMeasure: true,
                        roles: { 'MaxValue': true },
                    }
                ],
                groups: [],
                measures: [0]
            };

            categoryMetadata = {
                values: dataViewTransform.createValueColumns([
                    {
                        source: graphMetadata.columns[0],
                        values: [indicatedValue],
                    }, {
                        source: graphMetadata.columns[1],
                        values: [minValue],
                    }, {
                        source: graphMetadata.columns[2],
                        values: [maxValue],
                    }])
            };

            dataView = {
                metadata: graphMetadata,
                single: { value: indicatedValue },
                categorical: categoryMetadata
            };

            return dataView;
        };

        var createDefaultStyles = function createDefaultStyles() {

            var dataColors = new powerbi.visuals.DataColorPalette();

            return {
                titleText: {
                    color: { value: 'rgba(51,51,51,1)' }
                },
                subTitleText: {
                    color: { value: 'rgba(145,145,145,1)' }
                },
                colorPalette: {
                    dataColors: dataColors,
                },
                labelText: {
                    color: {
                        value: 'rgba(51,51,51,1)',
                    },
                    fontSize: '11px'
                },
                isHighContrast: false,
            };
        };

        var createVisual = function createVisual(targetControl) {

            var height;
            var pluginService;
            var singleVisualHostServices;
            var visual;
            var width;

            height = $(targetControl).height();
            width = $(targetControl).width();

            pluginService = powerbi.visuals.visualPluginFactory.create();
            singleVisualHostServices = powerbi.visuals.singleVisualHostServices;

            // Get a plugin
            visual = pluginService.getPlugin('gauge').create();

            visual.init({
                element: targetControl,
                host: singleVisualHostServices,
                style: createDefaultStyles(),
                viewport: {
                    height: height,
                    width: width
                },
                settings: { slicingEnabled: true },
                interactivity: { isInteractiveLegend: false, selection: false },
                animation: { transitionImmediate: true }
            });

            return visual;
        };

        var init = function init(telemetryHistorySummarySettings) {

            maxValue = telemetryHistorySummarySettings.gaugeMaxValue;
            minValue = telemetryHistorySummarySettings.gaugeMinValue;

            averageDeviceTemperatureContainer = telemetryHistorySummarySettings.averageDeviceTemperatureContainer;
            averageDeviceTemperatureControl = telemetryHistorySummarySettings.averageDeviceTemperatureControl;
            averageDeviceTemperatureLabel = telemetryHistorySummarySettings.averageDeviceTemperatureLabel;
            maxDeviceTemperatureContainer = telemetryHistorySummarySettings.maxDeviceTemperatureContainer;
            maxDeviceTemperatureControl = telemetryHistorySummarySettings.maxDeviceTemperatureControl;
            maxDeviceTemperatureLabel = telemetryHistorySummarySettings.maxDeviceTemperatureLabel;
            minDeviceTemperatureContainer = telemetryHistorySummarySettings.minDeviceTemperatureContainer;
            minDeviceTemperatureControl = telemetryHistorySummarySettings.minDeviceTemperatureControl;
            minDeviceTemperatureLabel = telemetryHistorySummarySettings.minDeviceTemperatureLabel;

            averageTemperatureVisual = createVisual(averageDeviceTemperatureControl);
            maxTemperatureVisual = createVisual(maxDeviceTemperatureControl);
            minTemperatureVisual = createVisual(minDeviceTemperatureControl);
        };

        var redraw = function redraw() {
            var height;
            var width;

            if (minDeviceTemperatureControl &&
                minTemperatureVisual &&
                (lastMinTemperature || (lastMinTemperature === 0))) {
                height = minDeviceTemperatureControl.height();
                width = minDeviceTemperatureControl.width();

                minTemperatureVisual.update({
                    dataViews: [createDataView(lastMinTemperature)],
                    viewport: {
                        height: height,
                        width: width
                    },
                    duration: 0
                });
            }

            if (maxDeviceTemperatureControl &&
                maxTemperatureVisual &&
                (lastMaxTemperature || (lastMaxTemperature === 0))) {
                height = maxDeviceTemperatureControl.height();
                width = maxDeviceTemperatureControl.width();

                maxTemperatureVisual.update({
                    dataViews: [createDataView(lastMaxTemperature)],
                    viewport: {
                        height: height,
                        width: width
                    },
                    duration: 0
                });
            }

            if (averageDeviceTemperatureControl &&
                averageTemperatureVisual &&
                (lastAvgTemperature || (lastAvgTemperature === 0))) {
                height = averageDeviceTemperatureControl.height();
                width = averageDeviceTemperatureControl.width();

                averageTemperatureVisual.update({
                    dataViews: [createDataView(lastAvgTemperature)],
                    viewport: {
                        height: height,
                        width: width
                    },
                    duration: 0
                });
            }
        };

        var resizeTelemetryHistorySummaryGuages =
            function resizeTelemetryHistorySummaryGuages() {

                var height;
                var padding;
                var width;

                padding = 0;

                if (averageDeviceTemperatureContainer &&
                    averageDeviceTemperatureLabel &&
                    averageDeviceTemperatureControl) {

                    height =
                        averageDeviceTemperatureContainer.height() -
                        averageDeviceTemperatureLabel.height() -
                        padding;

                    width = averageDeviceTemperatureContainer.width() - padding;

                    averageDeviceTemperatureControl.height(height);
                    averageDeviceTemperatureControl.width(width);
                }

                if (maxDeviceTemperatureContainer &&
                    maxDeviceTemperatureLabel &&
                    maxDeviceTemperatureControl) {

                    height =
                        maxDeviceTemperatureContainer.height() -
                        maxDeviceTemperatureLabel.height() -
                        padding;

                    width = maxDeviceTemperatureContainer.width() - padding;

                    maxDeviceTemperatureControl.height(height);
                    maxDeviceTemperatureControl.width(width);
                }

                if (minDeviceTemperatureContainer &&
                    minDeviceTemperatureLabel &&
                    minDeviceTemperatureControl) {

                    height =
                        minDeviceTemperatureContainer.height() -
                        minDeviceTemperatureLabel.height() -
                        padding;

                    width = minDeviceTemperatureContainer.width() - padding;

                    minDeviceTemperatureControl.height(height);
                    minDeviceTemperatureControl.width(width);
                }

                redraw();
            };

        var updateTelemetryHistorySummaryData =
            function updateTelemetryHistorySummaryData(
                minTemperature,
                maxTemperature,
                avgTemperature) {

                lastAvgTemperature = avgTemperature;
                lastMaxTemperature = maxTemperature;
                lastMinTemperature = minTemperature;

                redraw();
        };

        return {
            init: init,
            resizeTelemetryHistorySummaryGuages: resizeTelemetryHistorySummaryGuages,
            updateTelemetryHistorySummaryData: updateTelemetryHistorySummaryData
        };
    },
    [jQuery, resources, powerbi]);