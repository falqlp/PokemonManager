import { Injectable } from '@angular/core';
import { CacheService } from './cache.service';
import { RankingModel } from '../models/ranking.model';

interface CompetitionRanking {
  [trainerId: string]: number;
}

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  constructor(private readonly cacheService: CacheService) {}

  /**
   * Récupère le classement d'un entraîneur spécifique pour une compétition donnée.
   * @param competitionId ID de la compétition.
   * @param trainerId ID de l'entraîneur.
   * @returns Classement de l'entraîneur ou `null` s'il n'existe pas.
   */
  public getTrainerRanking(
    competitionId: string,
    trainerId: string
  ): number | null {
    const gameRankings = this.getGameRankings();
    return gameRankings?.[competitionId]?.[trainerId] ?? null;
  }

  /**
   * Met à jour le classement d'une compétition.
   * @param ranking Liste des classements.
   * @param competitionId ID de la compétition.
   */
  public updateCompetitionRanking(
    ranking: RankingModel[],
    competitionId: string
  ): void {
    const gameRankings = this.getGameRankings() ?? {};
    gameRankings[competitionId] = this.createCompetitionRanking(ranking);
    this.saveGameRankings(gameRankings);
  }

  /**
   * Met à jour les classements d'un groupe pour une compétition.
   * @param ranking Liste des classements par groupe.
   * @param competitionId ID de la compétition.
   */
  public updateGroupRanking(
    ranking: RankingModel[][],
    competitionId: string
  ): void {
    const gameRankings = this.getGameRankings() ?? {};
    gameRankings[competitionId] = this.createGroupRanking(ranking);
    this.saveGameRankings(gameRankings);
  }

  /**
   * Récupère les données des classements du jeu depuis le sessionStorage.
   * @returns Données des classements ou un objet vide si aucune donnée n'est trouvée.
   */
  private getGameRankings(): Record<string, CompetitionRanking> | null {
    const gameId = this.cacheService.getGameId();
    const rawData = sessionStorage.getItem(gameId);
    return rawData ? JSON.parse(rawData) : null;
  }

  /**
   * Sauvegarde les données des classements dans le sessionStorage.
   * @param gameRankings Données à sauvegarder.
   */
  private saveGameRankings(
    gameRankings: Record<string, CompetitionRanking>
  ): void {
    const gameId = this.cacheService.getGameId();
    sessionStorage.setItem(gameId, JSON.stringify(gameRankings));
  }

  /**
   * Crée une structure de classement à partir d'une liste de classements.
   * @param ranking Liste des classements.
   * @returns Objet contenant les ID des entraîneurs et leur classement.
   */
  private createCompetitionRanking(
    ranking: RankingModel[]
  ): CompetitionRanking {
    return ranking.reduce((acc, rk) => {
      acc[rk._id] = rk.ranking;
      return acc;
    }, {} as CompetitionRanking);
  }

  /**
   * Crée une structure de classement à partir d'une liste de groupes de classements.
   * @param ranking Liste des classements par groupe.
   * @returns Objet contenant les ID des entraîneurs et leur classement.
   */
  private createGroupRanking(ranking: RankingModel[][]): CompetitionRanking {
    return ranking.flat().reduce((acc, rk) => {
      acc[rk._id] = rk.ranking;
      return acc;
    }, {} as CompetitionRanking);
  }
}
