import getSchedule from "../utils/getSchedule";
import { useCallback } from "react";
import { Day, Game, Competitor } from "../types/schedule.types";
import convertDate from "../utils/convertDate";
import { useCachedPromise } from "@raycast/utils";

const useSchedule = () => {
  const fetchGames = useCallback(async () => {
    const currentDate = new Date();

    const data = await getSchedule({
      year: currentDate.getUTCFullYear(),
      month: currentDate.getUTCMonth() + 1,
      day: currentDate.getUTCDate(),
    });

    Object.keys(data).map((key) => {
      if (!Object.prototype.hasOwnProperty.call(data[key], "games")) {
        delete data[key];
      }
    });

    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const scheduledGames: Array<Day> = Object.keys(data).map((key) => {
      return {
        date: `${weekdays[new Date(data[key].games[0]?.date.toLocaleString("en-US")).getDay()]}  —  ${convertDate(
          key
        )}`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        games: data[key].games.map((game: any): Game => {
          return {
            id: game.id,
            name: game.name,
            shortName: game.shortName,
            time: new Date(game.date).toLocaleTimeString("en-US", { timeStyle: "short" }).toString(),
            competitors: game.competitions[0].competitors
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .map((competitor: any): Competitor => {
                return {
                  displayName: competitor.team.displayName,
                  shortName: competitor.team.shortDisplayName,
                  logo: competitor.team.logo,
                  home: competitor.homeAway,
                };
              })
              .sort((a: Competitor) => {
                return a.home === "home" ? -1 : 1;
              }),
            status: {
              period: game.competitions[0].status.period,
              clock: game.competitions[0].status.clock,
              completed: game.competitions[0].status.type.completed,
              inProgress: game.competitions[0].status.type.description === "In Progress",
            },
            stream: game.links[0].href,
          };
        }),
      };
    });

    return scheduledGames;
  }, []);

  return useCachedPromise(fetchGames);
};

export default useSchedule;
