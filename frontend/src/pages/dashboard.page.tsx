import React, { FC, useState, useEffect, useMemo } from "react";

import { RouteComponentProps } from "@reach/router";
import { IUserProps } from "../dtos/user.dto";
import { UserCard } from "../components/users/user-card";
import { Button, CircularProgress, Grid, TextField } from "@mui/material";

import { BackendClient } from "../clients/backend.client";

const backendClient = new BackendClient();

export const DashboardPage: FC<RouteComponentProps> = () => {
  const [userList, setUserList] = useState<IUserProps[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const result = await backendClient.getAllUsers();
      setUserList(result.data)
      setLoading(false)
    };

    fetchData();
  }, []);

  const filteredUserList = useMemo(() => {
    if (filter !== '') {
      return userList.filter((user) =>
        user.first_name.toLowerCase().includes(filter.trim())
      )
    }
    return userList
  }, [filter, userList])

  const paginatedList = useMemo(() => {
    return filteredUserList.slice((page - 1) * 5, (page * 5))
  }, [page, filteredUserList])

  const totalPages = useMemo(() => {
    return Math.ceil(filteredUserList.length / 5)
  }, [filteredUserList])

  return (
    <div style={{ paddingTop: "3rem" }}>
      <Grid container>
        <Grid item columns={12} md={4} />
        <Grid item columns={12} md={4}>
          <TextField
            type="text"
            placeholder="Search..."
            variant="outlined"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            fullWidth
          />
        </Grid>
      </Grid>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {
          loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
              }}
            >
              <CircularProgress size="60px" />
            </div>
          ) : (
            <div>
              {
                paginatedList.length
                  ? paginatedList.map((user) =>
                      <UserCard key={user.id} {...user} />
                    )
                  : null
              }
            </div>
          )
        }
      </div>
      <Grid alignItems="center" justifyContent="center" container>
        <Grid item columns={12} md={1}>
          <Button
            variant="contained"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
          >
            Prev
          </Button>
        </Grid>
        <Grid item columns={12} md={1}>
          Page {page} of {totalPages}
        </Grid>
        <Grid item columns={12} md={1}>
          <Button
            variant="contained"
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};
