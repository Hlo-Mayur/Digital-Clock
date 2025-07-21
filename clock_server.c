#include <stdio.h>
#include <time.h>
#include <string.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    time_t rawtime;
    struct tm * timeinfo;
    char date[64];
    int is24 = 0;
    char *ampm = "";
    int hour;

    if (argc > 1 && strcmp(argv[1], "24") == 0) {
        is24 = 1;
    }

    time(&rawtime);
    timeinfo = localtime(&rawtime);

    hour = timeinfo->tm_hour;
    if (!is24) {
        ampm = (hour >= 12) ? "PM" : "AM";
        hour = hour % 12;
        if (hour == 0) hour = 12;
    }

    strftime(date, sizeof(date), "%a, %B %e", timeinfo);

    printf("{\"hours\":\"%02d\",\"minutes\":\"%02d\",\"seconds\":\"%02d\",\"ampm\":\"%s\",\"date\":\"%s\"}\n",
        hour,
        timeinfo->tm_min,
        timeinfo->tm_sec,
        ampm,
        date
    );
    return 0;
} 