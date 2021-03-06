define(function () {

    return {
        drawOriginCircle: function (canvasContext) {
            canvasContext.context.beginPath();
            canvasContext.context.arc(canvasContext.getCenterX(), canvasContext.getCenterY(), 7, 0, 2 * Math.PI);
            canvasContext.context.fillStyle = "white";
            canvasContext.context.fill();
        },
        /**
         * Dessine les repères pour les heures dans le fond
         */
        drawBackground: function (canvasContext) {
            canvasContext.context.clearRect(0, 0, canvasContext.width, canvasContext.height);
            canvasContext.context.drawImage(canvasContext.clockBackground, 0, 0, canvasContext.width, canvasContext.height);
        },

        drawAnalogTime: function (canvasContext) {
            var now = new Date();

            var secProgress = now.getSeconds() / 60;
            var minProgress = now.getMinutes() / 60 + (1 / 60) * secProgress;
            var hourProgress = (now.getHours() % 12) / 12 + (1 / 12) * minProgress;

            drawArm({
                progress: hourProgress,
                thickness: 6,
                length: 0.45,
                color: '#FFFFFF'
            }, canvasContext);
            drawArm({
                progress: minProgress,
                thickness: 4,
                length: 0.60,
                color: '#FFFFFF'
            }, canvasContext);
            drawArm({
                progress: secProgress,
                thickness: 2,
                length: 0.72,
                color: '#FF0000'
            }, canvasContext);

            function drawArm(params, canvasContext) {
                const shiftFromCenter = 15;
                canvasContext.context.lineWidth = params.thickness;
                canvasContext.context.strokeStyle = params.color;
                drawLine(params.progress, shiftFromCenter / canvasContext.getClockRadius(), params.length, canvasContext);
            }

            /**
             * @param progress pourcentage de progression ex: 3h = 15min = 0.25; 6h = 30 min = 0.5
             * @param beginPercent début de la ligne en % du rayon
             * @param endPercent fin de la ligne en % du rayon
             */
            function drawLine(progress, beginPercent, endPercent, canvasContext) {
                // Must define TAU
                Math.TAU = 2 * Math.PI;
                var armRadians = (Math.TAU * (progress)) - (Math.TAU / 4);
                var startingPointX = canvasContext.getCenterX() + Math.cos(armRadians) * (beginPercent * canvasContext.getClockRadius());
                var startingPointY = canvasContext.getCenterY() + Math.sin(armRadians) * (beginPercent * canvasContext.getClockRadius());
                var endingPointX = canvasContext.getCenterX() + Math.cos(armRadians) * (endPercent * canvasContext.getClockRadius());
                var endingPointY = canvasContext.getCenterY() + Math.sin(armRadians) * (endPercent * canvasContext.getClockRadius());

                canvasContext.context.beginPath();
                canvasContext.context.moveTo(startingPointX, startingPointY);
                canvasContext.context.lineTo(endingPointX, endingPointY);
                canvasContext.context.stroke();
            }

        },

        drawNumericTime: function (canvasContext) {
            var now = new Date();
            var daysOfWeek = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];
            var displayDayOfWeek = daysOfWeek[now.getDay()];
            var displayCalendarDay = padZero(now.getDate()) + "/" + padZero(now.getMonth() + 1);

            canvasContext.context.strokeStyle = "#FFFFFF";
            canvasContext.context.textAlign = 'center';
            canvasContext.setFontSize(80);
            var dayOfWeekHeightPosition = -1.2;

            canvasContext.context.fillText(displayDayOfWeek,
                canvasContext.getCenterX(),
                canvasContext.getProportionalY(dayOfWeekHeightPosition));

            canvasContext.setFontSize(65);
            var dateHeightPosition = -1.6;

            canvasContext.context.fillText(displayCalendarDay,
                canvasContext.getCenterX(),
                canvasContext.getProportionalY(dateHeightPosition));

            function padZero(num) {
                var paddedString = String(num);
                if (num < 10) {
                    paddedString = "0" + String(num);
                }
                return paddedString;
            }
        },

        /**
         * ESSENTIELS
         */

        drawWeather: function (canvasContext, dataCtx) {
            var weatherInfo = dataCtx.weatherInfo;
            if (weatherInfo.weatherMessage != undefined) {
                var heightRatio = 3;
                var weatherIcon = weatherInfo.weatherIcon;

                var iconWidth = weatherIcon.width * 0.1;
                var iconHeight = weatherIcon.height * 0.1;

                canvasContext.context.drawImage(weatherIcon,
                    canvasContext.getCenterX() - 130 - iconWidth / 2,
                    canvasContext.getProportionalY(heightRatio),
                    iconWidth, iconHeight);

                canvasContext.setFontSize(32);
                heightRatio = 1.2;
                var formattedTemperature = weatherInfo.tempMin + "° - " + weatherInfo.tempMax + "°";

                canvasContext.context.fillText(formattedTemperature,
                    canvasContext.getCenterX() - 130,
                    canvasContext.getProportionalY(heightRatio));
            }
        },

        drawTraffic: function (canvasContext, dataCtx) {
            if (dataCtx.trafficInfo != undefined) {
                var trafficInfo = dataCtx.trafficInfo;
                if (trafficInfo != undefined) {
                    var heightRatio = 2.5;

                    var iconWidth = trafficInfo.trafficIcon.width * 0.4;
                    var iconHeight = trafficInfo.trafficIcon.height * 0.4;

                    canvasContext.context.drawImage(trafficInfo.trafficIcon,
                        canvasContext.getCenterX() + 130 - iconWidth / 2,
                        canvasContext.getProportionalY(heightRatio),
                        iconWidth, iconHeight);

                    heightRatio = 1.2;
                    canvasContext.setFontSize(32);

                    canvasContext.context.fillText(trafficInfo.trafficDuration + " min",
                        canvasContext.getCenterX() + 130,
                        canvasContext.getProportionalY(heightRatio));
                }
            }
        },

        drawAgenda: function (canvasContext) {
            var agendaIcon = new Image();
            agendaIcon.src = 'images/agenda/Agenda_Icon.png';

            var iconWidth = agendaIcon.width * 0.35;
            var iconHeight = agendaIcon.height * 0.35;

            var heightRatio = 1.1;
            canvasContext.context.drawImage(agendaIcon,
                canvasContext.getCenterX() - iconWidth / 2,
                canvasContext.getProportionalY(heightRatio),
                iconWidth, iconHeight);

            canvasContext.setFontSize(25);
            canvasContext.context.fillText("17h Dentiste",
                canvasContext.getCenterX(),
                canvasContext.getProportionalY(heightRatio) + 150);

        },

        drawBus: function (canvasContext, dataCtx) {
            var busIcon = new Image();
            busIcon.src = 'images/bus/Bus.png';

            var heightRatio = 3;
            var iconWidth = busIcon.width * 0.6;
            var iconHeight = busIcon.height * 0.6;

            canvasContext.context.drawImage(busIcon,
                canvasContext.getCenterX() - 130 - iconWidth / 2,
                canvasContext.getProportionalY(heightRatio),
                iconWidth, iconHeight);

            canvasContext.setFontSize(32);
            heightRatio = 1.2;
            var formattedTemperature = "20min";

            canvasContext.context.fillText(formattedTemperature,
                canvasContext.getCenterX() - 130,
                canvasContext.getProportionalY(heightRatio));
        },

        drawBourse: function (canvasContext, dataCtx) {
            var busIcon = new Image();
            busIcon.src = 'images/bourse/Bourse.png';

                var heightRatio = 2.5;

                var iconWidth = busIcon.width * 0.5;
                var iconHeight = busIcon.height * 0.5;

                canvasContext.context.drawImage(busIcon,
                    canvasContext.getCenterX() + 130 - iconWidth / 2,
                    canvasContext.getProportionalY(heightRatio),
                    iconWidth, iconHeight);

                heightRatio = 1.2;
                canvasContext.setFontSize(32);

                canvasContext.context.fillText("+4.20%",
                    canvasContext.getCenterX() + 130,
                    canvasContext.getProportionalY(heightRatio));
        },

        drawRSS: function (canvasContext, dataCtx) {
            var agendaIcon = new Image();
            agendaIcon.src = 'images/RSS/RSS.png';

            var iconWidth = agendaIcon.width * 0.5;
            var iconHeight = agendaIcon.height * 0.5;

            var heightRatio = 1.1;
            canvasContext.context.drawImage(agendaIcon,
                canvasContext.getCenterX() - iconWidth / 2,
                canvasContext.getProportionalY(heightRatio),
                iconWidth, iconHeight);

            heightRatio = 1.2;
            canvasContext.setFontSize(25);
            canvasContext.context.fillText("Nouveau podcast",
                canvasContext.getCenterX(),
                canvasContext.getProportionalY(heightRatio) + 150);

        }

    };
});